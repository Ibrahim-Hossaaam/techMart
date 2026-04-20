import React, { Suspense } from 'react'
import apiService from '../../../../services/api'
import ShoppingCart from './InnerCart'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../api/auth/[...nextauth]/authOptions'
import { Loader2 } from 'lucide-react'

export const revalidate = 0;
export const dynamic = 'force-dynamic';

function CartLoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your cart...</p>
      </div>
    </div>
  )
}

async function CartContent() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  const cartData = await apiService.getCart(session.user?.token as string);

  return <ShoppingCart cart={cartData} token={session.user?.token as string} />
}

export default function Cart() {
  return (
    <Suspense fallback={<CartLoadingFallback />}>
      <CartContent />
    </Suspense>
  )
}
