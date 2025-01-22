import pandas as pd
import yfinance as yf
import matplotlib.pyplot as plt

# Set the API 
crypto_currency = 'BTC'
against_currency = 'USD'
# Set the API parameters
date_today = "2020-01-01" # period start date
date_start = "2010-01-01" # period end date
symbol = "" # asset symbol - For more symbols check yahoo.finance.com


# Send the request to the yahoo finance api endpoint
df = yf.download(f'{crypto_currency}-{against_currency}', date_start, date_today)
print(df)

# Plot the closing prices
fig, ax1 = plt.subplots(figsize=(12, 8))
plt.plot(df.index, df.Close)
plt.show()