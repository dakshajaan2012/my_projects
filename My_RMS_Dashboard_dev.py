## import libraries
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

## assign app
app = dash.Dash(__name__, external_stylesheets=external_stylesheets)
server = app.server 
navbar = dbc.Nav()

## Retreive data from my SQL
def data_mysql():
    try:
        # Connect to MySQL database
        connection = sql.connect(host='localhost', database='mybase', user='sunil', password='pwd')
        cursor = connection.cursor(dictionary=True)
        # Execute SQL query to fetch data
        cursor.execute('SELECT * FROM rms')
        # Fetch data and create a DataFrame
        table_rows = cursor.fetchall()
        df = pd.DataFrame(table_rows)
        # Close the database connection
        cursor.close()
        connection.close()
        return df

    except Exception as e:
        print("Error:", e)  # Handle any errors here
        return None
    

#Total requests
@app.callback(Output('total', 'childern'), Input('interval-component', 'n_intervals'))
def update_total(n_intervals):
    df = data_mysql()

    if df is not None:
        open_requests = df.groupby(['status'])['category'].count()
        my_open_requests = open_requests.get([1])
        #print(my_open_requests)
        close_requests = df.groupby(['status'])['category'].count()
        my_close_requests = open_requests.get([0])
        #print(my_close_requests)
        global total
        total = df.status.count()
        return total
    else:
        return {}
        

# barchart1, issue
@app.callback(Output('barchart1', 'figure'), Input('interval-component', 'n_intervals'))  
def update_barchart1(n_intervals):
    df = data_mysql()
    df= df.iloc[:,0:len(df)]# data retrieval
    pd.set_option('display.max_columns', 10)
    pd.set_option('display.max_rows', 10)
    pd.set_option('display.width', 1000)
    df['issue'] = df['issue'].str.rstrip() # remove extra leading and trailing spaces

    if df is not None:
        # get top 10 most frequent issues
        df1=df['issue'].value_counts()[:10].sort_values(ascending=False)
        labels = list(dict(df1)) # labels
        global barchart1
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

        return barchart1
    else:
        return {}
    

# Pie1 chart- Type
@app.callback(Output('pie1', 'figure'), Input('interval-component', 'n_intervals'))
def update_pie1(n_intervals):
    df = data_mysql()

    if df is not None:

        v = df.groupby(['type'])['status'].count()
        labels = list(set(df['type']))
        labels.sort()

        global pie1
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

        return pie1
    else:
        return {}
    

# pie chart- Category
@app.callback(Output('pie2', 'figure'), Input('interval-component', 'n_intervals'))
def update_pie2(n_intervals):
    df = data_mysql()

    if df is not None:

        s = df.groupby(['category'])['status'].count()
        labels1 = list(set(df['category']))
        labels1.sort()

        global pie2
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
        return pie2
    else:
        return {}


# Pie chart, monthly request rate
@app.callback(Output('pie4', 'figure'), Input('interval-component', 'n_intervals'))
def update_pie4():
    df = data_mysql() 

    if df is not None:

        df['date'] = pd.to_datetime(df['date'])
        global m
        m = df.groupby(df['date'].dt.month)['issue'].count()
        labels = list(set(df['date'].dt.month))
        #labels.sort()

        month_names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        labels.sort(key=lambda x: x if x != 12 else 0) ## Get month names corresponding to the sorted month numbers

        global pie4
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
        return pie4
    else:
        return {}


# Bar chart - name- top 10
@app.callback(Output('barchart2', 'figure'), Input('interval-component', 'n_intervals'))
def update_barchart2(n_intervals):
    df = data_mysql()

    if df is not None:
    
        df['name'] = df['name'].str.strip()

        k=df['name'].value_counts()[:10].sort_values(ascending=False)
        labels = list(dict(k)) # labels
        #labels.sort()
        #print(k)
        #print(df1.head(10))
        #df1 = df1.fillna(0)
        global barchart2
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
        return barchart2
    else:
        return {}
    

# Average request per day calculations
def update_days(n_intervals):
    df = data_mysql()
    m=m
    df['total_issues'] = df.groupby('date')['issue'].transform('count')
    #m_days = m.value_counts().sum()*((365.25/7)*5)/12
    #t_days = m.sum()
    #ave_requests_per_day = t_days/m_days
    ave_requests_per_day = df['total_issues'].mean()

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


if __name__ == '__main__':
    #app.run_server(debug=True, port=8056)
    #app.run_server()
    import webbrowser
    webbrowser.open('http://127.0.0.1:8050')
    #app.run_server(debug=True, port=8050)
    app.run_server()


