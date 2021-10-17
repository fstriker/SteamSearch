import csv
import pandas as ps
from os import error, write

from pandas.core.base import PandasObject
from pandas.io import json



def csJson():
    f = open('cleanedSteam.json','w',encoding='utf-8')

    with open('steam_games.csv',newline='',encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        try:
            for row in reader:
                f.write(json.dumps(row))
                f.write("\n")
        except Exception as e:
            print(e)
             
    f.close()
    print(reader.line_num)
    
def csCSV():
    f = open('cleanedSteam.csv','w',newline='',encoding='utf-8')
    writer = csv.writer(f)
    
    with open('steam_games.csv',newline='',encoding='utf-8') as csvfile:
        reader = csv.reader(csvfile)
        try:
            for row in reader:
                writer.writerow(row)
        except Exception as e:
            print(e)
         
    f.close()
    print(reader.line_num)

#csCSV()

#csJson()