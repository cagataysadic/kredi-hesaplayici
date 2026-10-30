# Kredi Taksit Hesaplayıcı – Loan Installment Calculator

A small vanilla JavaScript app that calculates equal monthly installments for Turkish loans (housing, personal and vehicle), including the KKDF and BSMV taxes, and shows a month-by-month payment plan.

**Live demo:** https://cagataysadic.github.io/kredi-hesaplayici/

## Features

- Three loan types: housing (*konut*), personal (*ihtiyaç*) and vehicle (*taşıt*)
- 12, 24 or 36-month terms
- Equal-installment (annuity) calculation
- KKDF and BSMV (15% each, charged on interest) for personal and vehicle loans; housing loans are exempt
- Summary: monthly installment, total interest, taxes, total repayment and monthly rate
- Payment plan: installment, interest, taxes, principal and remaining balance for every month
- Turkish lira formatting with `Intl.NumberFormat` (₺12.256,82)
- Inline, accessible validation instead of `alert` (`aria-invalid`, `aria-live`)
- Responsive layout; the payment table scrolls horizontally on small screens
- Visible keyboard focus

## How the calculation works

Each loan type has a fixed sample monthly rate (`r`) defined in `hesap.js`. KKDF and BSMV are charged as a percentage of the interest, so the installment is calculated with a gross rate:

```
gross       = r × (1 + KKDF + BSMV)
installment = P × gross × (1 + gross)^n / ((1 + gross)^n − 1)
```

`P` is the loan amount and `n` is the number of months. Then, for every month:

```
interest  = remaining balance × r
KKDF      = interest × 15%
BSMV      = interest × 15%
principal = installment − interest − KKDF − BSMV
remaining = remaining − principal
```

The remaining balance reaches zero in the last month, which doubles as a self-check.

**Example:** personal loan, 100,000 TL, 12 months, 5% monthly. The installment is ₺12.256,82, and the first month splits into ₺5.000,00 interest, ₺1.500,00 taxes and ₺5.756,82 principal.

## Tech stack

- HTML and CSS (custom properties as design tokens, BEM-style class names)
- Vanilla JavaScript with ES modules: no framework, no build step
- Designed in Figma

## Project structure

```
├── index.html   # Markup
├── style.css    # Design tokens and styles
├── app.js       # Form handling, validation messages, rendering
└── hesap.js     # Pure calculation and validation functions (no DOM)
```

## Running locally

ES modules don't load over `file://`, so the page needs a local server.

1. Clone the repository: `git clone https://github.com/cagataysadic/kredi-hesaplayici.git`
2. Open the folder in VS Code and start **Live Server** on `index.html` (any static server works).

## What I learned

- How the equal-installment formula works, and why the last remaining balance should reach zero.
- Keeping the calculation in pure functions (`hesap.js`), separate from the DOM (`app.js`), made it easy to check with `console.table`.
- Form values are always strings: `Number("")` is `0` and `Number("4.000.000")` is `NaN`, so validation has to look at the raw text.
- A function returns a single value: `return a, b` quietly returns only `b`.
- The `hidden` attribute stops working when a class sets `display`, and a wide table inside a CSS grid needs `minmax(0, 1fr)` to stay inside the page.

## What I would do differently / next steps

- Let users enter their own interest rate instead of using a fixed rate per loan type
- Accept Turkish number formats such as `4.000.000` and `100.000,50`
- Add a "show more" toggle for long payment plans
- Round installments to the kuruş and adjust the last payment, as banks do
- Replace the manual console checks with automated tests

## Disclaimer

The interest rates are sample values for demonstration. Real loans may include fees and insurance, and tax rates can change (the KKDF and BSMV rates above are as of 2026). This is not financial advice.