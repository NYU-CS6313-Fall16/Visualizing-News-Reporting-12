import json
import csv
from datetime import datetime
# from bson import json_util
from pymongo import MongoClient

"""
article_id,
story_id,
harvested_at,
entities_name_1,
entities_ticker_1,
entities_global_id_1,
entities_entity_id_1,
entities_type_1,
entities_exchange_1,
entities_sector_1,
entities_industry_1,
entities_country_1,
entities_region_1,
entities_index_1,
entities_competitors_1,
entities_name_2,
entities_ticker_2,
entities_global_id_2,
entities_entity_id_2,
entities_type_2,
entities_exchange_2,
entities_sector_2,
entities_industry_2,
entities_country_2,
entities_region_2,
entities_index_2,
entities_competitors_2,
event_groups_group_1,
event_groups_type_1,
event_groups_group_2,
event_groups_type_2,
story_sentiment,
story_saturation,
story_volume,
first_mention,
article_type,
article_sentiment,
overall_source_rank,
event_source_rank_1,
event_source_rank_2,
overall_author_rank,
event_author_rank_1,
event_author_rank_2,
event_impact_score_overall,
event_impact_score_entity_1,
event_impact_score_entity_2,
event_summary_group,
event_summary_theme,
event_summary_topic,
event_summary_action,
event_summary_sub-theme,
event_summary_acting_party,
article_url

[0, article_id] [,article_url] 
[event_groups_group_1,event_groups_type_1,event_groups_group_2,event_groups_type_2]
[entities_name_1, entities_name_2] 
[harvested_at]
[first_mention]
[]
"""

#jsonfile = open('news_sample.json', 'wb')

'''
data = []
'key'] = 'value'
json_data = json.dumps(data)

response = []
for row in z['rows']:
    for key, dict_list in row.iteritems():
        count = dict_list[1]
        year = dict_list[2]
        response.append({'count': count['v'], 'year' : year['v']})

 print json.dumps(response)
'''
'''
            data={
                'article_id':row[0],
                'harvested_at':row[2],      #"2016-01-01 00:04:43 UTC"
                'entities_name_1':row[3],
                'entities_name_2':row[15],
                'event_groups_group_1':row[27],
                'event_groups_type_1':row[28],
                'event_groups_group_2':row[29],
                'event_groups_type_2':row[30],
                'first_mention':row[34],
                'article_url':row[52],
            }
            '''
'''
{
        corp: ["Twitter  Inc."],
        id: "5775b29f3a8ffe29560a87b9",
        time: new Date(2016, 7, 1, 0, 0, 16),
        topic: [
            {
                group: "Legal Actions",
                type: "Allegation"
            }
        ],
        website: "radionowindy.com"
    },
'''
client = MongoClient('localhost', 27017)
db = client.news
articles_collection = db.articles


dictbywebsite = {}

with open('backtest_students_sample.csv') as csvfile:
    count = 500
    #data = []
    for line in csvfile:
        count = count - 1
        if count < 499 and count > 1:
            row = line.split(',')
            corp = []
            if row[3] != "":
                corp.append(row[3])
            if row[15] != "":
                corp.append(row[15])
            #print(row[2])
            time = datetime.strptime(row[2], "%Y-%m-%d %H:%M:%S %Z")
            #print(time)
            topic = []
            if row[27] != "":
                topic.append({'group':row[27], 'type':row[28]})
            if row[29] != "":
                topic.append({'group':row[29], 'type':row[30]})


            if row[34] == "true":
                first_mention = True;
            else:
                first_mention = False;

            #
            article_url = row[52]
            urlsplit = article_url.split('/')
            website = urlsplit[2]

            """
            data.append({
                'corp':corp,
                'id':row[0],
                'time':time,
                'topic':topic,
                #'website':website,
                'first_mention':first_mention
            })
            """
            article = {
                'website':website,
                'corp':corp,
                'id':row[0],
                'time':time,
                'topic':topic,
                'first_mention':first_mention
                }

            #print(article)
            articles_collection.insert(article)
'''
            if website not in dictbywebsite:
                dictbywebsite[website] = list()
            
            dictbywebsite[website].append(article)        

news_json = json.dumps(dictbywebsite, default=json_util.default)
jsonfile.write(news_json)
print(count)
#json.dump(news_json, jsonfile)
#jsonfile.write('\n')
jsonfile.close()
'''

