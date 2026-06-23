"use client";

import { useState, useEffect } from "react";
import { DollarSign, Percent, Calendar, Calculator, TrendingUp } from "lucide-react";
import { formatPrice } from "./PropertyCard";

interface RoiCalculatorProps {
  propertyPrice: number;
}

export default function RoiCalculator({ propertyPrice }: RoiCalculatorProps) {
  // Inputs state
  const [price, setPrice] = useState(propertyPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  
  // Estimate monthly rent based on ~3.5% standard residential yield if not provided
  const defaultRent = Math.round((propertyPrice * 0.035) / 12);
  const [monthlyRent, setMonthlyRent] = useState(defaultRent);

  // Calculated outputs
  const [downPaymentAmount, setDownPaymentAmount] = useState(0);
  const [loanAmount, setLoanAmount] = useState(0);
  const [monthlyEmi, setMonthlyEmi] = useState(0);
  const [netCashFlow, setNetCashFlow] = useState(0);
  const [cashOnCashRoi, setCashOnCashRoi] = useState(0);

  useEffect(() => {
    // 1. Down Payment
    const dp = Math.round(price * (downPaymentPercent / 100));
    setDownPaymentAmount(dp);

    // 2. Loan Principal
    const loan = price - dp;
    setLoanAmount(loan);

    // 3. EMI Calculation
    if (loan <= 0) {
      setMonthlyEmi(0);
      setNetCashFlow(monthlyRent);
      setCashOnCashRoi(dp > 0 ? ((monthlyRent * 12) / dp) * 100 : 0);
      return;
    }

    const r = interestRate / 12 / 100; // Monthly interest rate
    const n = tenureYears * 12; // Total monthly payments
    
    // Standard EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const emi = Math.round(
      loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1)
    );
    setMonthlyEmi(emi);

    // 4. Cash Flow
    const flow = monthlyRent - emi;
    setNetCashFlow(flow);

    // 5. Cash-on-Cash Return: (Annual Cashflow / Down Payment) * 100
    const annualCashflow = flow * 12;
    const roi = dp > 0 ? (annualCashflow / dp) * 100 : 0;
    setCashOnCashRoi(roi);
  }, [price, downPaymentPercent, interestRate, tenureYears, monthlyRent]);

  return (
    <div className="glass rounded-xl p-6 border-border/80 space-y-6">
      <div className="flex items-center gap-2 border-b border-border/50 pb-3">
        <Calculator className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold">Investment ROI Calculator</h3>
      </div>

      <div className="space-y-4">
        {/* Price Input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Property Value (INR)
          </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-secondary border border-border/85 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>

        {/* Down Payment Percent Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Down Payment: {downPaymentPercent}%</span>
            <span className="text-primary font-bold">{formatPrice(downPaymentAmount)}</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Interest Rate Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Interest Rate: {interestRate}%</span>
            <span>Loan Amt: {formatPrice(loanAmount)}</span>
          </div>
          <input
            type="range"
            min="5"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(parseFloat(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Tenure Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs font-semibold text-muted-foreground">
            <span>Loan Tenure: {tenureYears} Years</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={tenureYears}
            onChange={(e) => setTenureYears(parseInt(e.target.value))}
            className="w-full h-1 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Rent Estimate Input */}
        <div>
          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">
            Estimated Monthly Rent (INR)
          </label>
          <input
            type="number"
            value={monthlyRent}
            onChange={(e) => setMonthlyRent(parseFloat(e.target.value) || 0)}
            className="w-full rounded-lg bg-secondary border border-border/85 px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Outputs Panel */}
      <div className="bg-secondary/40 border border-border/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Monthly EMI Payment:</span>
          <span className="font-bold text-foreground">{formatPrice(monthlyEmi)}</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">Net Monthly Cash Flow:</span>
          <span className={`font-extrabold ${netCashFlow >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
            {netCashFlow >= 0 ? "+" : ""}
            {formatPrice(netCashFlow)}/mo
          </span>
        </div>

        <div className="flex justify-between items-center border-t border-border/40 pt-2 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground font-semibold text-xs">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span>Cash-on-Cash ROI:</span>
          </div>
          <span className={`font-black ${cashOnCashRoi >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
            {cashOnCashRoi.toFixed(2)}% / yr
          </span>
        </div>
      </div>
    </div>
  );
}
