from urllib.request import urlopen as uReq
from bs4 import BeautifulSoup as soup

from googlesearch import search
from firebase import firebase
# fix .async issue from firebase library https://www.youtube.com/watch?v=TiMACTNbNl8
#tutorial database  https://codeloop.org/python-firebase-real-time-database/

firebase = firebase.FirebaseApplication('https://ny-sub-sta-articles.firebaseio.com/', None)


# to search
query = "irishtimes Crime in Dublin"

url = []

for j in search(query, tld="com", num=10, stop=10, pause=2):
    url.append(j)

print (url)


for my_url in url:
    try:
        uClient = uReq(my_url)
        page_html = uClient.read()
        uClient.close()

        # html parsing

        page_soup = soup(page_html, "html.parser")

        time = page_soup.find("time").get_text()
        load = page_soup.find("div", {"class": "article_bodycopy"})

        items = load.find_all("p", {"class": "no_name"})
        text = [item.get_text() for item in items]

        data = {'time': time,
                'text': text
                }

        result = firebase.post('/articles/', data )


    except:
        pass


#result2 = firebase.get('/articles/', '')
#print(result2)
