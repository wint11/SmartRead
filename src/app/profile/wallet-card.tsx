"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Diamond, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { initShopSession, purchaseVip, recharge } from "./actions"

export function WalletCard({ initialBalance }: { initialBalance: number }) {
  const [balance, setBalance] = React.useState(initialBalance)
  const [result, setResult] = React.useState<{success: boolean, message: string} | null>(null)
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    setBalance(initialBalance)
  }, [initialBalance])

  React.useEffect(() => {
    initShopSession().catch(() => {})
  }, [])

  const handleRecharge = async () => {
      const res = await recharge()
      if (res.success) {
          setBalance(res.balance)
      }
  }

  const handlePurchase = async () => {
    setIsLoading(true)
    setResult(null)
    
    try {
        const res = await purchaseVip()
        setResult(res)
    } catch (e) {
        setResult({ success: false, message: "交易失败" })
    } finally {
        setIsLoading(false)
    }
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            我的钱包
        </CardTitle>
        <CardDescription>管理您的账户余额与会员服务</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1 overflow-y-auto">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border">
            <div>
                <div className="text-sm text-muted-foreground">当前余额</div>
                <div className="text-2xl font-bold flex items-center gap-1">
                    {balance.toLocaleString()} 
                    <span className="text-xs text-muted-foreground font-normal ml-1">金币</span>
                </div>
            </div>
            <Button variant="outline" size="sm" onClick={handleRecharge}>充值</Button>
        </div>

        <div className="space-y-4">
            <h4 className="text-sm font-medium">会员服务</h4>
            <div className="border rounded-lg p-4 flex items-center justify-between bg-card text-card-foreground">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <Diamond className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                        <div className="font-bold">愚者会员 (永久)</div>
                        <div className="text-xs text-muted-foreground">解锁《诡秘之主》VIP章节</div>
                    </div>
                </div>
                <div className="text-right">
                    <div className="font-bold text-lg">1,000,000</div>
                    <div className="text-xs text-muted-foreground">金币</div>
                </div>
            </div>
        </div>

        {result && (
            <Alert variant={result.success ? "default" : "destructive"} className={result.success ? "border-green-500 bg-green-50 dark:bg-green-950/20" : ""}>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{result.success ? "购买成功！" : "购买失败"}</AlertTitle>
              <AlertDescription className="mt-2 font-mono break-all text-xs">
                {result.message}
              </AlertDescription>
            </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
            className="w-full" 
            onClick={handlePurchase}
            disabled={isLoading}
        >
            {isLoading ? "处理中..." : "立即购买会员"}
        </Button>
      </CardFooter>
    </Card>
  )
}
