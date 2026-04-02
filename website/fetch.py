import urllib.request
import re
import json

urls = {
    'FIpJrVsDBms': 'https://www.youtube.com/watch?v=FIpJrVsDBms',
    'NJ9wcG9tZR0': 'https://www.youtube.com/watch?v=NJ9wcG9tZR0',
    'E4VaTWRhQPg': 'https://www.youtube.com/watch?v=E4VaTWRhQPg',
    'V8JyZl0Xwbs': 'https://www.youtube.com/watch?v=V8JyZl0Xwbs',
    'TKn4gFmjkoI': 'https://www.youtube.com/watch?v=TKn4gFmjkoI',
    'OaKsnIY-0BA': 'https://www.youtube.com/shorts/OaKsnIY-0BA',
    'hteU4F6T19s': 'https://www.youtube.com/shorts/hteU4F6T19s',
    'TXgvzQNOLmw': 'https://www.youtube.com/shorts/TXgvzQNOLmw',
    'QEUMOYqMsUU': 'https://www.youtube.com/shorts/QEUMOYqMsUU',
    'xUUqi0HkJrw': 'https://www.youtube.com/shorts/xUUqi0HkJrw'
}

results = {}

for id, url in urls.items():
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        title = title_match.group(1).replace(' - YouTube', '') if title_match else 'Unknown'
        
        view_match = re.search(r'"viewCount":"(\d+)"', html)
        views = view_match.group(1) if view_match else '0'
        
        v = int(views)
        if v >= 1000000:
            v_str = f"{v/1000000:.1f}M Views"
        elif v >= 1000:
            v_str = f"{v//1000}K Views"
        else:
            v_str = f"{v} Views"
            
        results[id] = {'title': title, 'views': v_str}
    except Exception as e:
        results[id] = {'title': str(e), 'views': '0 views'}

with open('yt_data.json', 'w', encoding='utf-8') as f:
    json.dump(results, f, indent=2)
print("SUCCESS")
