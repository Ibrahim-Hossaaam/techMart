import React, { useState } from 'react'
import { AspectRatio } from '../ui/aspect-ratio'
import { Button } from '../ui/button'
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { CartProduct as ICartProduct } from '@/interfaces/cart/CartProduct'



export default function CartProduct({item,removeItem,updateProductCount}:{item:ICartProduct;
     removeItem: (productId: string) => Promise<void>;
     updateProductCount: (productId: string, count: number) => Promise<void>;
    }) {

  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isIncreasing, setIsIncreasing] = useState(false);
  const [isDecreasing, setIsDecreasing] = useState(false);

async function handleRemoveFromCart() {
  setIsDeleting(true);
  await removeItem(item.product._id);
  setIsDeleting(false);
}


async function handleUpdateCount(count: number) {
  if(count>item.count){
    setIsIncreasing(true);
  }else{
    setIsDecreasing(true);
  }

   
  setIsUpdating(true);
  await updateProductCount(item.product._id, count);
  setIsUpdating(false);
  setIsIncreasing(false);
  setIsDecreasing(false);
}

  



  return (
     <div
                  key={item._id}
                  className="flex gap-4 rounded-lg border bg-card p-4"
                >
                  <div className="w-24 shrink-0">
                    <AspectRatio
                      ratio={1}
                      className="overflow-hidden rounded-md bg-muted"
                    >
                      <img
                        src={item.product.imageCover}
                        alt={item.product.title}
                        className="size-full object-cover"
                      />
                    </AspectRatio>
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h3 className="font-medium">{item.product.title}</h3>
                      {/* {item.variant && (
                        <p className="text-sm text-muted-foreground">
                          {item.variant}
                        </p>
                      )} */}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                     disabled={item.count==1||isUpdating}
                        onClick={() => handleUpdateCount(item.count - 1)}
                      >
                     {  isDecreasing ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                       <Minus className="size-3" />)}
                      </Button>
                      <span className="w-8 text-center">{item.count}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="size-8"
                        onClick={() => handleUpdateCount(item.count + 1)}
                        disabled={isUpdating}
                        
                      >
                     {  isIncreasing ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        <Plus className="size-3" />
                      )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-between">
                    <div className="text-right">
                      <p className="font-semibold">
                        {formatPrice(item.price * item.count)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatPrice(item.price)} each
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground"
                      onClick={handleRemoveFromCart}
                      disabled={isDeleting}
                    >
                      {isDeleting ? (
                        <Loader2 className="mr-1 size-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-1 size-4" />
                      )}
                      Remove
                    </Button>
                  </div>
                </div>
  )
}
