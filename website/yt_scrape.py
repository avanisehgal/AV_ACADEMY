import urllib.request
import re

urls = [
    ('Video 1', 'https://www.youtube.com/watch?v=FIpJrVsDBms'),
    ('Video 2', 'https://www.youtube.com/watch?v=NJ9wcG9tZR0'),
    ('Video 3', 'https://www.youtube.com/watch?v=E4VaTWRhQPg'),
    ('Video 4', 'https://www.youtube.com/watch?v=V8JyZl0Xwbs'),
    ('Video 5', 'https://www.youtube.com/watch?v=TKn4gFmjkoI'),
    ('Short 1', 'https://www.youtube.com/shorts/OaKsnIY-0BA'),
    ('Short 2', 'https://www.youtube.com/shorts/hteU4F6T19s'),
    ('Short 3', 'https://www.youtube.com/shorts/TXgvzQNOLmw'),
    ('Short 4', 'https://www.youtube.com/shorts/QEUMOYqMsUU'),
    ('Short 5', 'https://www.youtube.com/shorts/xUUqi0HkJrw')
]

for name, url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        title_match = re.search(r'<title>(.*?)</title>', html)
        title = title_match.group(1).replace(' - YouTube', '') if title_match else 'Unknown'
        
        view_match = re.search(r'"viewCount":"(\d+)"', html)
        views = view_match.group(1) if view_match else '0'
        
        v = int(views)
        if v >= 1000000:
            v_str = f"{v/1000000:.1f}M views"
        elif v >= 1000:
            v_str = f"{v//1000}K views"
        else:
            v_str = f"{v} views"
            
        print(f"{name} | {title} | {v_str}")
    except Exception as e:
        print(f"{name} | Error {e}")
