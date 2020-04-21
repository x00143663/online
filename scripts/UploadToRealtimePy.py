from firebase import firebase
key=3
firebase = firebase.FirebaseApplication("https://ny-sub-sta.firebaseio.com/", None )
data =   {
      "geometry" : {
        "coordinates" : [ -6.322464, 53.392852 ],
        "type" : "Point"
            },
        "properties" : {
            "category" : "dogattack",
            "date" : "19/10/2019",
            "description" : "The biggest increases in recorded drug crime countrywide are occurring outside Dublin as the drugs trade is now buoyant after the recession....",
            "name" : "dog attack",
            "placeid" : "04",
            "url" : "https://www.irishtimes.com/news/crime-and-law/biggest-increases-in-recorded-drug-crime-are-outside-dublin-1.4064397"
        },
            "type" : "Feature"
}
result = firebase.put("data/features/",key,data)
print(result)
key=4

data =   {
      "geometry" : {
        "coordinates" : [ -6.293945, 53.335703],
        "type" : "Point"
            },
        "properties" : {
            "category" : "kidnap",
            "date" : "19/10/2019",
            "description" : "The biggest increases in recorded drug crime countrywide are occurring outside Dublin as the drugs trade is now buoyant after the recession....",
            "name" : "kidnapping children",
            "placeid" : "05",
            "url" : "https://www.irishtimes.com/news/crime-and-law/dublin-council-workers-moved-from-certain-areas-due-to-threats-from-criminals-1.4053063"
        },
            "type" : "Feature"
}
result = firebase.put("data/features/",key,data)
print(result)
