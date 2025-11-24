import { palettes } from '@/common/palettes';
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';
import { getCategoryList } from '@/services/Category.services';
import { toast } from 'sonner';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { simpleIconCdn } from '@/lib/utils';
import Image from 'next/image';
import { Plus, Minus, ChevronRight, ArrowUp, ArrowDown } from 'lucide-react';


const Balance = ({ balance = 1243.72,
  income = 4200.5,
  expenses = 2956.78, }) => {
  const format = (v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  const [selectedOptions, setSelectedOptions] = React.useState('')
  const [category, setCategory] = React.useState([])
  const [selectedcategory, setSelectedCategory] = React.useState({})
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)


  const isMobile = useIsMobile();

  const getCatList = async () => {
    await getCategoryList()
      .then(res => {
        setCategory(res || [])
        setSelectedCategory(res?.[0] || {})
      })
      .catch(err => {
        toast.error(err?.message || 'something went wrong')
      })
  }

  const handleCategoryClick = (item) => {
    console.log(item, 'item')
    setSelectedCategory(item || {})

  }

  React.useEffect(() => {
    getCatList()
  }, [])

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6" >

      <div
        className="md:col-span-2 rounded-2xl p-5 shadow-2xl mb-8 border border-gray-700/50"
        style={{ backgroundColor: palettes.dark[800] }}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">Net Balance</p>
            <h1 className="text-4xl md:text-5xl font-extrabold mt-1" style={{ color: palettes.primary[400] }}>
              {format(balance)}
            </h1>
            <div className="mt-5 flex flex-col md:flex-row gap-4 md:gap-8 text-white">

              {/* Income */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-700/50">
                <ArrowUp className="w-5 h-5" style={{ color: palettes.green[500] }} />
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Income</div>
                  <div className="font-semibold text-lg" style={{ color: palettes.green[500] }}>{format(income)}</div>
                </div>
              </div>

              {/* Expenses */}
              <div className="flex items-center gap-3 p-2 rounded-xl bg-gray-700/50">
                <ArrowDown className="w-5 h-5" style={{ color: palettes.red[500] }} />
                <div>
                  <div className="text-xs text-gray-400 uppercase tracking-wider">Expenses</div>
                  <div className="font-semibold text-lg" style={{ color: palettes.red[500] }}>{format(expenses)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for Donut Chart/Visualization */}
          <div className="hidden md:flex items-center justify-center relative w-36 h-36">
            <div
              className="w-full h-full rounded-full border-[8px]"
              style={{
                borderColor: palettes.red[600],
                borderLeftColor: palettes.dark[900],
              }}
            >
              <div className="absolute inset-0 m-2 rounded-full" style={{ backgroundColor: palettes.dark[900] }}></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center" style={{ color: palettes.primary[400] }}>
                  <div className="text-sm text-gray-400 font-medium">Spent</div>
                  <div className="text-2xl font-bold">{1}%</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights row (Revamped small cards) */}
        <div className="mt-8 flex gap-3 flex-wrap">
          {/* Child 1: Full width on mobile, roughly 1/3 on medium screens and up */}
          <div className="w-full md:w-[calc(33.33%-0.5rem)] p-3 rounded-xl text-sm shadow-inner" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
            <div className="text-gray-400 text-xs uppercase tracking-wider">This Month</div>
            <div className="font-medium text-white mt-1">{format(100)} spent</div>
          </div>
          {/* Child 2: Full width on mobile, roughly 1/3 on medium screens and up */}
          <div className="w-full md:w-[calc(33.33%-0.5rem)] p-3 rounded-xl text-sm shadow-inner" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Subscriptions</div>
            <div className="font-medium text-white mt-1">{100} active</div>
          </div>
          {/* Child 3: Full width on mobile, roughly 1/3 on medium screens and up */}
          <div className="w-full md:w-[calc(33.33%-0.5rem)] p-3 rounded-xl text-sm shadow-inner" style={{ backgroundColor: palettes.dark[900], border: '1px solid #334155' }}>
            <div className="text-gray-400 text-xs uppercase tracking-wider">Budget Left</div>
            <div className="font-medium mt-1" style={{ color: palettes.green[500] }}>{format(100)}</div>
          </div>
        </div>
      </div>


      {/* Quick actions column */}
      <aside
        className="bg-gray-800/80 w-full p-4 rounded-2xl  flex flex-col gap-4 max-w-sm mx-auto md:max-w-full"
        style={{ background: palettes.dark[800],  }}
      >
        <div className="text-xl font-extrabold text-white tracking-wider">Quick Actions</div>

        <div className="flex flex-col w-full md:grid-cols-2 p-4 gap-4">

          {/* Add Expense Button (Themed Red for outflow) */}
          <Button
            onClick={() => { setSelectedOptions('Expense'); setIsSheetOpen(true) }}
            className="flex items-center justify-between p-6 shadow-lg   transition-all duration-300"
            style={{
              backgroundColor: palettes.dark[800],
              color: palettes.red[500],
              border: `2px solid ${palettes.red[500]}`,
            }}
          >
            <div className="flex items-center gap-3">
              <Minus className="w-6 h-6 p-1 rounded-full bg-red-800 text-white" />
              <span className="font-bold text-lg text-white">Add Expense</span>
            </div>
            <ChevronRight className="w-5 h-5 text-red-500" />
          </Button>

          {/* Add Income Button (Themed Green for inflow) */}
          <Button
            onClick={() => { setSelectedOptions('Income'); setIsSheetOpen(true) }}
            className="flex items-center justify-between p-6 shadow-lg  transition-all duration-300"
            style={{
              backgroundColor: palettes.dark[800],
              color: palettes.green[500],
              border: `2px solid ${palettes.green[500]}`,
            }}
          >
            <div className="flex items-center gap-3">
              <Plus className="w-6 h-6 p-1 rounded-full bg-green-800 text-white" />
              <span className="font-bold text-lg text-white">Add Income</span>
            </div>
            <ChevronRight className="w-5 h-5 text-green-500" />
          </Button>
        </div>
      </aside>

      <Sheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      >
        <SheetContent
          side={isMobile ? "bottom" : "right"}
          style={{ backgroundColor: palettes.dark[800], borderWidth: '0', borderRadius: isMobile ? '24px 24px 0px 0px' : '' }}
        >
          <SheetHeader>
            <h1 className="text-2xl font-extrabold text-white">
              {selectedOptions === 'Income' ? 'Enter Details' : 'Add Expense'}
            </h1>
          </SheetHeader>
          <div className="w-full">
            <ScrollArea className="h-[calc(100dvh-24rem)] w-full p-4">
              <div className=" pt-2 space-y-2">
                <p className="text-sm text-gray-400 mb-4">Select a category to continue:</p>
                {category.map(category => {
                  return (
                    <div
                      key={category.id}
                      // onClick={() => onSelectCategory(category)}
                      className="w-full flex items-center justify-between p-4 bg-gray-700/50 hover:bg-gray-700 rounded-xl transition duration-150"
                    >
                      <div className="flex items-center">
                        <div className={`p-2 rounded-lg bg-gray-800 ${category.color}`}>
                          <Image
                            src={simpleIconCdn(category.icon)}
                            style={{
                              filter:
                                "invert(75%) sepia(24%) saturate(1063%) hue-rotate(210deg) brightness(98%) contrast(92%)",
                            }}
                            alt={category.icon}
                            width={28}
                            height={28}
                          />
                        </div>
                        <span className="ml-4 text-white font-medium">{category.name}</span>
                      </div>
                      <Image
                        style={{
                          color: palettes.primary[400],
                        }}
                        width={28}
                        height={28}
                        src='/arrow.svg'
                        alt={'arrow'}
                      />
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </SheetContent>
      </Sheet>
    </section >
  );
};

export default Balance;