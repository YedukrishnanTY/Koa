import { palettes } from '@/common/palettes';
import React from 'react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useIsMobile } from '@/hooks/use-mobile';
import { getCategoryList } from '@/services/Category.services';
import { toast } from 'sonner';

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Icon, { simpleIconCdn } from '@/lib/utils';
import Image from 'next/image';

const Balance = ({ balance = 1243.72,
  income = 4200.5,
  expenses = 2956.78, }) => {
  const format = (v) => v.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  const [selectedOptions, setSelectedOptions] = React.useState('')
  const [category, setCategory] = React.useState([])
  const [selectedcategory, setSelectedCategory] = React.useState({})

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

      <div className="md:col-span-2 bg-white rounded-2xl p-5 shadow-md" style={{ backgroundColor: palettes.dark[800] }}>
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-gray-400">Net balance</p>
            <h1 className="text-2xl md:text-3xl font-bold mt-1">{format(balance)}</h1>
            <div className="mt-3 flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-xs text-green-600">▲</span>
                <div>
                  <div className="text-xs">Income</div>
                  <div className="font-medium">{format(income)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-600">▼</span>
                <div>
                  <div className="text-xs">Expenses</div>
                  <div className="font-medium">{format(expenses)}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder for sparkline / donut */}
          <div className="hidden md:flex items-center"  >
            <div className="w-36 h-36 rounded-full bg-gradient-to-tr from-indigo-100 to-indigo-50 flex items-center justify-center">
              <div className="text-sm text-indigo-700">Spending
                <div className="text-2xl font-semibold">60%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Insights row (small cards) */}
        <div className="mt-5 grid grid-cols-3 gap-3">
          <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium">This month</div>
            <div className="mt-1">Spent {format(1200)}</div>
          </div>
          <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium">Subscriptions</div>
            <div className="mt-1">3 active</div>
          </div>
          <div className="col-span-1 bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium">Budget left</div>
            <div className="mt-1">{format(300)}</div>
          </div>
        </div>
      </div>


      {/* Quick actions column */}

      <Sheet style={{}}>
        <aside className="bg-white rounded-2xl p-4 shadow-md flex flex-col gap-3" style={{ backgroundColor: palettes.dark[800] }}>
          <div className="text-sm font-medium">Quick actions</div>
          <SheetTrigger asChild>
            <Button
              onClick={() => setSelectedOptions('Expense')}
              style={{
                color: palettes.primary[400],
                backgroundColor: palettes.slate[100],
              }} className="font-bold">+ Add expense</Button>
          </SheetTrigger>
          <SheetTrigger asChild>
            <Button
              onClick={() => setSelectedOptions('Income')}
              style={{
                color: palettes.primary[400],
                backgroundColor: palettes.slate[100],
              }} className="font-bold ">+ Add income</Button>
          </SheetTrigger>
        </aside>

        <SheetContent
          side={isMobile ? "bottom" : "right"}
          className={isMobile ? "rounded-t-4xl" : "rounded-l-xl"}
          style={{ backgroundColor: palettes.dark[800], borderWidth: '0',borderRadius : isMobile ? '24px 24px 0px 0px' : '24px 0px 0px 24px' }}
        >
          <SheetHeader>
            <SheetTitle className='text-2xl' style={{ color: palettes.primary[400] }}>Add {selectedOptions}</SheetTitle>
            <SheetDescription style={{ color: palettes.light[100] }}>
              {selectedOptions === "Expense" &&
                "Add your expense details below and save when you're done."}

              {selectedOptions === "Income" &&
                "Add your income details below and save when you're done."}
            </SheetDescription>
          </SheetHeader>
          <div className="w-full">

            <ScrollArea className="h-[calc(100dvh-24rem)] w-full  p-4">
              <div className="flex flex-col space-y-2 gap-2">

                {category.map(item => (
                  <div
                    key={item._id}
                    style={{
                      color: palettes.light[100],
                      backgroundColor: 'transparent',
                      padding: '8px'
                    }} className="font-bold flex gap-6 justify-between"
                    onClick={() => handleCategoryClick(item)}
                  >
                    <div className='flex flex-row font-bold flex gap-3'>
                      <Image
                        src={simpleIconCdn(item.icon)}
                        style={{
                          filter:
                            "invert(75%) sepia(24%) saturate(1063%) hue-rotate(210deg) brightness(98%) contrast(92%)",
                        }}
                        alt={item.icon}
                        width={28}
                        height={28}
                      />
                      {item.name}
                    </div>
                    <Image
                      style={{
                        color: palettes.primary[400],
                      }}
                      width={28}
                      height={28}
                      src='/arrow.svg'
                      alt={item.icon}
                    />
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          {/* <SheetFooter>
            <Button style={{
              backgroundColor: palettes.primary[400],
              color: palettes.slate[100],
            }} className="font-bold" type="submit">Add {selectedOptions}</Button>
            <SheetClose asChild>
              <Button style={{
                color: palettes.primary[400],
                backgroundColor: palettes.slate[100],
              }} className="font-bold" variant="outline">Close</Button>
            </SheetClose>
          </SheetFooter> */}
        </SheetContent>
      </Sheet>
    </section >
  );
};

export default Balance;