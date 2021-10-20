import pandas as pd


partOne = pd.read_csv('steam.csv')
partTwo = pd.read_csv('steam_media_data.csv')
partOne['steam_appid']=partOne['steam_appid'].astype(int)
partTwo['steam_appid']=partTwo['steam_appid'].astype(int)
result = pd.merge(partOne,partTwo, on="steam_appid",how="inner")

result.to_csv('steamshop.csv')