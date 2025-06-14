import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt


crypto_currency = 'BTC'
against_currency = 'USD'
date_today = "2020-01-01"
date_start = "2010-01-01" 
symbol = "" 

df = yf.download(f'{crypto_currency}-{against_currency}', date_start, date_today)
print(df)

# Plot the closing prices
fig, ax1 = plt.subplots(figsize=(12, 8))
plt.plot(df.index, df.Close)
plt.show()