import {
    Body,
    Controller,
    Get,
    Headers,
    HttpCode,
    HttpException,
    HttpStatus,
    UseGuards,
    Post,
    Param,
    Put,
    Delete,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AccountService } from '../service/account.service';
import { TokenService } from '../service/token.services';
import { JwtAuthGuard } from '../user/jwt.guard';
import { User } from '../user/user.decorator';
import { ExpenseService } from 'src/service/expense.service';

@Controller('account')
export class AccountController {
    constructor(private readonly accountService: AccountService,
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
        private readonly expenseService: ExpenseService,

    ) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles('ADMIN')
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllAccounts() {
        return this.accountService.getAllAccounts();
    }

    // Get accounts for the token user
    @UseGuards(AuthGuard('jwt'))
    @Get('/all')
    @HttpCode(HttpStatus.OK)
    async getAccountsPerUser(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const payload = { userName: username };
        if (!payload.userName) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Username not found in token' }, HttpStatus.BAD_REQUEST);
        }
        return (await this.accountService.getAccountByUserName(payload)) || [];
    }

    //  get accounts by username 
    @UseGuards(AuthGuard('jwt'))
    @Get('/user')
    @HttpCode(HttpStatus.OK)
    async getByUsername(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        return (await this.accountService.getAccountByUsernameParam(username)) || [];
    }

    // Create account: username from token, other fields from body
    @UseGuards(AuthGuard('jwt'))
    @Post('/create')
    @HttpCode(HttpStatus.CREATED)
    async createAccount(@Headers() headers: Record<string, any>, @Body() body: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { ...body, username };
        const created = await this.accountService.createAccount(accountPayload);
        return created;
    }

    @UseGuards(AuthGuard('jwt'))
    @UseGuards(JwtAuthGuard)
    @Put('/create')
    @HttpCode(HttpStatus.CREATED)
    async EditAccount(@Headers() headers: Record<string, any>, @Body() body: { _id: string } & Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { username, ...body };
        const fetchValue = await this.accountService.updateAccount(accountPayload);

        if (!fetchValue) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Account details not found' }, HttpStatus.BAD_REQUEST);
        }
        return fetchValue;
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/create')
    @HttpCode(HttpStatus.CREATED)
    async DeleteAccount(@Headers() headers: Record<string, any>, @Body() body: { _id: string } & Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountPayload = { username, ...body, isDeleted: true };
        const fetchValue = await this.accountService.updateAccount(accountPayload);

        if (!fetchValue) {
            throw new HttpException({ statusCode: HttpStatus.BAD_REQUEST, message: 'Account details not found' }, HttpStatus.BAD_REQUEST);
        }
        return fetchValue;
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/details')
    @HttpCode(HttpStatus.OK)
    async getDetailsByUsername(@Headers() headers: Record<string, any>) {
        const username = this.tokenService.getUsernameFromHeaders(headers);
        const accountDetails = (await this.accountService.getAccountByUsernameParam(username)) || [];

        // --- Sum balance per currency (defensive) ---
        const balanceByCurrency: Record<string, number> = {};
        for (const acc of accountDetails) {
            const a: any = acc?.[0] ?? acc;
            if (!a) continue;
            const cur = a.currency ?? 'UNKNOWN';
            const bal = Number(a.balance ?? 0);
            balanceByCurrency[cur] = (balanceByCurrency[cur] || 0) + (isNaN(bal) ? 0 : bal);
        }

        // --- Get expenses/transactions for the user ---
        // Each item expected to have: createdAt, price|amount, currency (or accountCurrency), isIncome (boolean)
        const expenses = (await this.expenseService.getExpenseByUserName(username)) || [];

        // Quick return when no transactions
        if (!Array.isArray(expenses) || expenses.length === 0) {
            // compute account-derived income if wanted (income = balance + expenseAmount)
            const totalIncomeByCurrencyFromAccounts: Record<string, number> = {};
            for (const acc of accountDetails) {
                const a: any = acc?.[0] ?? acc;
                const cur = a?.currency ?? 'UNKNOWN';
                const balance = Number(a?.balance ?? 0);
                const spent = Number(a?.expenseAmount ?? 0);
                totalIncomeByCurrencyFromAccounts[cur] = (totalIncomeByCurrencyFromAccounts[cur] || 0) + (isNaN(balance + spent) ? 0 : (balance + spent));
            }

            return {
                accounts: accountDetails,
                balanceByCurrency,
                months: [],
                chartData: { labels: [], datasets: [] },
                monthlyIncomeByCurrency: {},
                monthlyExpenseByCurrency: {},
                totalIncomeByCurrencyTransactions: {},
                totalExpenseByCurrencyTransactions: {},
                totalIncomeByCurrencyFromAccounts
            };
        }

        // --- Build monthKeys from transactions (YYYY-MM) and sort oldest->newest ---
        const monthSet = new Set<string>();
        for (const t of expenses) {
            const created = t?.createdAt ? new Date(t.createdAt) : null;
            if (!created || isNaN(created.getTime())) continue;
            const yyyy = created.getFullYear();
            const mm = String(created.getMonth() + 1).padStart(2, '0');
            monthSet.add(`${yyyy}-${mm}`);
        }
        const monthKeys = Array.from(monthSet).sort((a, b) => a.localeCompare(b));
        const labels = monthKeys.map(k => {
            const [yyyy, mm] = k.split('-');
            const d = new Date(Number(yyyy), Number(mm) - 1, 1);
            return d.toLocaleString('en-US', { month: 'short', year: 'numeric' });
        });

        // --- Aggregate: per-currency per-month, separated by isIncome ---
        // byCurrencyAndMonthIncome: { "USD": { "2025-11": 120, ... }, ... }
        const byCurrencyAndMonthIncome: Record<string, Record<string, number>> = {};
        const byCurrencyAndMonthExpense: Record<string, Record<string, number>> = {};
        const currenciesSeen = new Set<string>();

        for (const t of expenses) {
            const created = t?.createdAt ? new Date(t.createdAt) : null;
            if (!created || isNaN(created.getTime())) continue;
            const yyyy = created.getFullYear();
            const mm = String(created.getMonth() + 1).padStart(2, '0');
            const key = `${yyyy}-${mm}`;

            // only include months we've collected (safe-guard)
            if (!monthKeys.includes(key)) continue;

            const currency = (t.currency ?? 'UNKNOWN').toString();
            currenciesSeen.add(currency);
            const amount = Number(t?.price ?? 0);
            const isIncome = Boolean(t?.isIncome);

            if (isIncome) {
                if (!byCurrencyAndMonthIncome[currency]) byCurrencyAndMonthIncome[currency] = {};
                byCurrencyAndMonthIncome[currency][key] = (byCurrencyAndMonthIncome[currency][key] || 0) + (isNaN(amount) ? 0 : amount);
            } else {
                if (!byCurrencyAndMonthExpense[currency]) byCurrencyAndMonthExpense[currency] = {};
                byCurrencyAndMonthExpense[currency][key] = (byCurrencyAndMonthExpense[currency][key] || 0) + (isNaN(amount) ? 0 : amount);
            }
        }

        // include currencies from accounts even if they had no transactions (optional)
        for (const cur of Object.keys(balanceByCurrency)) currenciesSeen.add(cur);

        // --- Build aligned arrays (oldest -> newest) for each currency ---
        const monthlyIncomeByCurrency: Record<string, number[]> = {};
        const monthlyExpenseByCurrency: Record<string, number[]> = {};
        for (const currency of Array.from(currenciesSeen)) {
            monthlyIncomeByCurrency[currency] = monthKeys.map(k => Number(byCurrencyAndMonthIncome[currency]?.[k] || 0));
            monthlyExpenseByCurrency[currency] = monthKeys.map(k => Number(byCurrencyAndMonthExpense[currency]?.[k] || 0));
        }

        // --- Totals from transactions ---
        const totalIncomeByCurrencyTransactions: Record<string, number> = {};
        const totalExpenseByCurrencyTransactions: Record<string, number> = {};
        for (const currency of Object.keys(monthlyIncomeByCurrency)) {
            totalIncomeByCurrencyTransactions[currency] = monthlyIncomeByCurrency[currency].reduce((s, v) => s + v, 0);
        }
        for (const currency of Object.keys(monthlyExpenseByCurrency)) {
            totalExpenseByCurrencyTransactions[currency] = monthlyExpenseByCurrency[currency].reduce((s, v) => s + v, 0);
        }

        // --- Optional: income derived from accounts (income = balance + expenseAmount) as fallback/extra ---
        const totalIncomeByCurrencyFromAccounts: Record<string, number> = {};
        for (const acc of accountDetails) {
            const a: any = acc?.[0] ?? acc;
            if (!a) continue;
            const cur = a.currency ?? 'UNKNOWN';
            const balance = Number(a?.balance ?? 0);
            const spent = Number(a?.expenseAmount ?? 0);
            totalIncomeByCurrencyFromAccounts[cur] = (totalIncomeByCurrencyFromAccounts[cur] || 0) + (isNaN(balance + spent) ? 0 : (balance + spent));
        }

        // --- Prepare chart-friendly datasets: we provide datasets for income and expense per currency ---
        // Frontend can style them separately. We provide labels (human) and months (keys).
        const datasets: Array<{ label: string; data: number[]; meta?: string }> = [];
        // Income datasets
        for (const [currency, arr] of Object.entries(monthlyIncomeByCurrency)) {
            datasets.push({ label: `${currency} (income)`, data: arr, meta: 'income' });
        }
        // Expense datasets
        for (const [currency, arr] of Object.entries(monthlyExpenseByCurrency)) {
            datasets.push({ label: `${currency} (expense)`, data: arr, meta: 'expense' });
        }

        const chartData = { labels, datasets };

        return {
            accounts: accountDetails,
            balanceByCurrency,
            months: monthKeys, // machine-friendly keys: ["2025-09","2025-10"...]
            chartData,         // labels: human labels; datasets: income & expense datasets per currency
            monthlyIncomeByCurrency,   // { "AED": [..], "USD": [..] } aligned with months
            monthlyExpenseByCurrency,  // { "AED": [..], "USD": [..] } aligned with months
            totalIncomeByCurrencyTransactions, // totals computed from expense docs where isIncome === true
            totalExpenseByCurrencyTransactions, // totals computed from expense docs where isIncome === false
            totalIncomeByCurrencyFromAccounts   // optional fallback: income inferred from account balances
        };
    }


}