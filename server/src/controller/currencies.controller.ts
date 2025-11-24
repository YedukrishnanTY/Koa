import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    ConflictException,
    NotFoundException,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { CurrenciesService } from '../service/currencies.service';

@Controller('Currencies')
export class CurrenciesController {
    constructor(private readonly CurrenciesService: CurrenciesService) { }

    // GET /Currencies
    @Get()
    @HttpCode(HttpStatus.OK)
    async getAllCurrencies() {
        const currencies = await this.CurrenciesService.getAllCurrencies();
        return [...currencies];
    }

}
