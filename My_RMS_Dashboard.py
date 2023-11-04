import mysql.connector as sql
import pandas as pd
## import pygal libraries
import pygal
from IPython.display import display, HTML
import numpy as np

## java script
base_html = """
        <!DOCTYPE html>
        <html>
            <head>
            <script type="text/javascript" src="http://kozea.github.com/pygal.js/javascripts/svg.jquery.js"></script>
            <script type="text/javascript" src="https://kozea.github.io/pygal.js/2.0.x/pygal-tooltips.min.js""></script>
            </head>
            <body>
            <figure>
                {rendered_chart}
            </figure>
            </body>
        </html>
        """



## above Pygal
import dash
import dash_core_components as dcc
#import dash_html_components as html
from dash import html
import dash_bootstrap_components as dbc
from dash.dependencies import Input, Output, State
import chart_studio.plotly as py
import plotly.graph_objs as go
import plotly.express as px
from plotly.graph_objs import scatter
external_stylesheets =['https://codepen.io/chriddyp/pen/bWLwgP.css', dbc.themes.BOOTSTRAP, 'style.css']
import numpy as np
import pandas as pd
import mysql.connector as sql
import time

app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server 
navbar = dbc.Nav()


## MYSQL connections
#import mysql.connector as sql
connection = sql.connect(host='localhost', database='mydatabase', user='root', password='my-secret-pwd')
cursor = connection.cursor(dictionary=True)
cursor.execute('SELECT * FROM rms')

table_rows = cursor.fetchall()
df = pd.DataFrame(table_rows)
df= df.iloc[:,0:len(df)]# data retrieval
pd.set_option('display.float', '{:.2f}'.format)
pd.set_option('display.max_columns', 10)
pd.set_option('display.max_rows', 10)
pd.set_option('display.width', 1000)


#print(df.head())
#print(df.isna().sum()) #count missing values of all columns

#total requests 
open_requests = df.groupby(['status'])['category'].count()
my_open_requests = open_requests.get([1])
#print(my_open_requests)

close_requests = df.groupby(['status'])['category'].count()
my_close_requests = open_requests.get([0])
#print(my_close_requests)

total = df.status.count()
#print(total)

## create bar graph (not used)
df1 = df.groupby(['category'])['status'].count()
df1 = df1.reset_index()
df1 = df1.sort_values(['category'],ascending=False)

#print(df2.head(10))
barchart = go.Bar(x=df1[('category')], y=df1[('status')], name='category')
barchart =  dcc.Graph(id='barchart',
            figure={
        'data': [(barchart)],
                #go.Bar(x=df3['Name'],
                        #y=df3['test'])],

        'layout': {'title':dict(
            text = 'Requests Distribution',
            font = dict(size=20,
            color = 'white')),
        "paper_bgcolor":"#111111",
        "plot_bgcolor":"#111111",
        'height':600,
        "line":dict(
                color="white",
                width=4,
                dash="dash",
            ),
        'xaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='',color='white'),
        'yaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='Number of Requests',color='white')
    }})


## top 10 issue chart
#connection = sql.connect(host='localhost', database='mydatabase', user='root', password='my-secret-pwd')
#cursor = connection.cursor(dictionary=True)
#cursor.execute('SELECT * FROM rms')
#table_rows = cursor.fetchall()
#df = pd.DataFrame(table_rows)

df= df.iloc[:,0:len(df)]# data retrieval
#pd.set_option('display.float', '{:.2f}'.format)
pd.set_option('display.max_columns', 10)
pd.set_option('display.max_rows', 10)
pd.set_option('display.width', 1000)

df['issue'] = df['issue'].str.rstrip()

# get top 10 most frequent names
#df1 = df1.reset_index()
#df1 = df1.sort_values(['issue'],ascending=False)
df1=df['issue'].value_counts()[:10].sort_values(ascending=False)
labels = list(dict(df1)) # labels
#labels.sort()
#print(df1)
#print(df1.head(10))
#df1 = df1.fillna(0)
barchart1 = go.Bar(x=labels, y= df['issue'].value_counts()[:10], name='issue',marker=dict(color='green'))

barchart1 =  dcc.Graph(id='barchart1',
            figure={
        'data': [(barchart1)],
                #go.Bar(x=df3['Name'],
                        #y=df3['test'])],

        'layout': {'title':dict(
            text = 'Top 10 Requests',
            font = dict(size=20,
            color = 'white')),
        "paper_bgcolor":"#111111",
        "plot_bgcolor":"#111111",
        'height':500,
        "line":dict(
                color="white",
                width=4,
                dash="dash",
            ),
        'xaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='',color='white'),
        'yaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='Number of Requests',color='white')
    }})

#barchart1.render_in_browser()  


##pie chart- type

v = df.groupby(['type'])['status'].count()
labels = list(set(df['type']))
labels.sort()

pie1 = dcc.Graph(
        id = "pie1",
        figure = {
        "data": [
            {
            "labels": labels,
            "values":v,
            "hoverinfo":"label+percent",
            "hole": .7,
            "type": "pie",
                'marker': {'colors': [
                                                '#0052cc',  
                                                '#3385ff',
                                                '#99c2ff'
                                                ]
                                    },
            "showlegend": True
}],
        "layout": {
                "title" : dict(text ="Requests type",
                            font =dict(
                            size=20,
                            color = 'white')),
                "paper_bgcolor":"#111111",
                "showlegend":True,
                'height':500,
                'marker': {'colors': [
                                                '#0052cc',  
                                                '#3385ff',
                                                '#99c2ff'
                                                ]
                                    },
                "annotations": [
                    {
                        "font": {
                            "size": 20
                        },
                        "showarrow": False,
                        "text": "",
                        "x": 0.2,
                        "y": 0.2
                    }
                ],
                "showlegend": True,
                "legend":dict(fontColor="white",tickfont={'color':'white' }),
                "legenditem": {
    "textfont": {
    'color':'white'
    }
            }
        } }
)



## pie chart- Category
s = df.groupby(['category'])['status'].count()
labels1 = list(set(df['category']))
labels1.sort()

pie2 = dcc.Graph(
        id = "pie2",
        figure = {
        "data": [
            {
            "labels":labels1,
            "values":s,
            "hoverinfo":"label+percent",
            "hole": .7,
            "type": "pie",
                'marker': {'colors': [
                                                '#0052cc',  
                                                '#3385ff',
                                                '#99c2ff'
                                                ]
                                    },
            "showlegend": True
}],
        "layout": {
                "title" : dict(text ="Requests category",
                            font =dict(
                            size=20,
                            color = 'white')),
                "paper_bgcolor":"#111111",
                "showlegend":True,
                'height':500,
                'marker': {'colors': [
                                                '#0052cc',  
                                                '#3385ff',
                                                '#99c2ff'
                                                ]
                                    },
                "annotations": [
                    {
                        "font": {
                            "size": 20
                        },
                        "showarrow": False,
                        "text": "",
                        "x": 0.2,
                        "y": 0.2
                    }
                ],
                "showlegend": True,
                "legend":dict(fontColor="white",tickfont={'color':'white' }),
                "legenditem": {
    "textfont": {
    'color':'white'
    }
            }
        } }
)

## line, not using
#print(df2.head(10))
df3 = df.groupby(['date'])['status'].count()
df3 = df3.reset_index()
df3 = df3.sort_values(['status'],ascending=False)
line = go.Line(x=df3[('date')], y=df3[('status')], name='date')

line =  dcc.Graph(id='line',
            figure={
        'data': [(line)],
                #go.Bar(x=df3['Name'],
                        #y=df3['Votes'])],

        'layout': {'title':dict(
            text = 'Daily Spending Chart',
            font = dict(size=20,
            color = 'white')),
        "paper_bgcolor":"#111111",
        "plot_bgcolor":"#111111",
        'height':600,
        "line":dict(
                color="white",
                width=4,
                dash="dash",
            ),
        'xaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='',color='white'),
        'yaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='Spending ($)',color='white')
    }})



df['date'] = pd.to_datetime(df['date'])
m = df.groupby(df['date'].dt.month)['issue'].count()
labels = list(set(df['date'].dt.month))
#labels.sort()

month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

labels.sort(key=lambda x: x if x != 12 else 0) ## Get month names corresponding to the sorted month numbers



pie4 = dcc.Graph(
    id="pie4",
    figure={
        "data": [
            {
                "labels": month_names,
                "values": m,
                "hoverinfo": "label+percent",
                "hole": 0.7,
                "type": "pie",
                "marker": {
                    "colors": [
                        '#0052cc',
                        '#3385ff',
                        '#99c2ff'
                    ]
                },
            }
        ],
        "layout": {
            "title": {
                "text": "Monthly request rate",
                "font": {
                    "size": 20,
                    "color": 'white'
                }
            },
            "paper_bgcolor": "#111111",
            "height": 500,
            "showlegend": True,
            "legend": {
                "fontColor": "white",
                "itemFontColor": "white"
            },
            "annotations": [
                {
                    "font": {
                        "size": 20
                    },
                    "showarrow": False,
                    "text": "",
                    "x": 0.2,
                    "y": 0.2
                }
            ]
        }
    }
)


##pie chart - name- top 10
df['name'] = df['name'].str.strip()

k=df['name'].value_counts()[:10].sort_values(ascending=False)
labels = list(dict(k)) # labels
#labels.sort()
#print(k)
#print(df1.head(10))
#df1 = df1.fillna(0)
barchart2 = go.Bar(x=labels, y= df['name'].value_counts()[:10], name='name',marker=dict(color='orange'))


barchart2 =  dcc.Graph(id='barchart2',
            figure={
        'data': [(barchart2)],
                #go.Bar(x=df3['Name'],
                        #y=df3['test'])],

        'layout': {'title':dict(
            text = 'Top 10 Requestors',
            font = dict(size=20,
            color = 'white')),
        "paper_bgcolor":"#111111",
        "plot_bgcolor":"#111111",
        'height':500,
        "line":dict(
                color="white",
                width=4,
                dash="dash",
            ),
        'xaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='',color='white'),
        'yaxis' : dict(tickfont=dict(
            color='white'),showgrid=False,title='Number of Requests',color='white')
    }})

# Average request per day calculations
# Add total daily issues
df1['total_issues'] = df.groupby('date')['issue'].transform('count')
#df1
#m_days = m.value_counts().sum()*((365.25/7)*5)/12
#t_days = m.sum()
#ave_requests_per_day = t_days/m_days
ave_requests_per_day = df1['total_issues'].mean()

## total request counts
total= html.Div(
                        children=[
                            html.P("Jan-now, 2023 Total Requests:",
                        
                                style={
                                    'fontSize': 20,
                                    'color': 'White',
                                }
                            ),
                            html.P('{0:.0f}'.format(total),
                                style={
                                    'fontSize': 65,
                                    'color': 'red',
                                }
                            ),
                            html.P('Req/day:',
                                style={
                                    'fontSize': 20,
                                    'color': 'White',
                                }
                            ),
                                html.P('{0:.0f}'.format(ave_requests_per_day),
                                style={
                                    'fontSize': 65,
                                    'color': 'yellow',
                                }
                            )
                        ], 
                        style={
                            'width': '57%', 
                            'display': 'inline-block'
                        }
                    )



graphRow1 = dbc.Row([dbc.Col(barchart1,md=5),dbc.Col(barchart2,md=5), dbc.Col(total, md=2)])
graphRow2 = dbc.Row([dbc.Col(pie1, md=4), dbc.Col(pie2, md=4),dbc.Col(pie4, md=4)])
#graphRow2 = dbc.Row([dbc.Col(trace_pie, md=6), dbc.Col(trace_pie1, md=6)])
#graphRow3 = dbc.Row([dbc.Col(line,md=12)])
app.layout = html.Div([navbar,html.Br(),graphRow1,html.Br(),graphRow2,html.Br()], style={'backgroundColor':'black'})
#app.layout = html.Div([navbar,html.Br(),graphRow1,html.Br()], style={'backgroundColor':'black'})


# Define a global variable to store the DataFrame
#global df
#global table_rows
#df = pd.DataFrame()  # Initialize an empty DataFrame

def update_data():
    #global df
    #global table_rows
    while True:
        try:
            # Connect to MySQL database
            connection = sql.connect(host='localhost', database='mydatabase', user='root', password='my-secret-pwd')
            cursor = connection.cursor(dictionary=True)

            # Execute SQL query to fetch data
            cursor.execute('SELECT * FROM rms')

            # Fetch data and create a DataFrame
            table_rows = cursor.fetchall()
            df = pd.DataFrame(table_rows)

            # Close the database connection
            cursor.close()
            connection.close()

            # Update your Dash components with the latest data
            # For example, you can update a dcc.Graph, dcc.DataTable, etc.
            # Replace the following line with your actual update logic
            # app.layout = updated_layout(df)

        except Exception as e:
            print("Error:", e)  # Handle any errors here

        # Wait for a certain interval before fetching data again
        time.sleep(1800)  # Fetch data every 5 seconds
# Run the update_data function in a separate thread to continuously fetch data
import threading
data_thread = threading.Thread(target=update_data)
data_thread.daemon = True  # This allows the thread to exit when the main script exits
data_thread.start()


if __name__ == '__main__':
    #app.run_server(debug=True, port=8056)
    #app.run_server()
    import webbrowser
    webbrowser.open('http://127.0.0.1:8050')
    #app.run_server(debug=True, port=8050)
    app.run_server()


