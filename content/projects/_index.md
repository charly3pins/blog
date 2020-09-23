+++
title = "Collectus"
+++

Final degree project.

It is a system flexible database for collectibles and any other objects or data the user want to have ordered and classified. Collectus is though for collectors, allowing them to keep track of any kind of collection they have, using a system database with an open structure adaptable to every need. It also provides two types of login for the users, creating a new one for the platform or using their Facebook account connecting it with the Facebook API. 

![app](/images/projects/collectus/main-app.jpeg)
![login](/images/projects/collectus/login.jpeg)

Using templates the user can set all kinds of records for such diverse items as stamps or placas of cava, posters or fossils, rag dolls or lottery tickets. Once defined the template (category) for the object or type of object of interest, and the user can enter data immediately.

![item edit](/images/projects/collectus/item-edit.jpeg)
![amazon mapping](/images/projects/collectus/amazon-mapping.jpeg)

To facilitate all this task, it incorporates tools to help the user. The most prominent it is provided by the Amazon Product API to automatically read information from its database at the time of data entry.

![amazon search](/images/projects/collectus/amazon-search.jpeg)

From here users will be able to read information according to various search criteria offered in the application and store them. There is also a price comparison between the various Amazon shops in all countries to find different prices and assist in the purchase of items to users. 

![amazon results](/images/projects/collectus/amazon-results.jpeg)

All this has been developed under an attractive GUI and usability as a main goal.

Programming languages and tools used for this project:
- PHP 5, JavaScript and jQuery for the backend
- HTML and CSS for the frontend
- AJAX as the way of calling the server side
- Amazon Product API for the product research and price comparision
- Facebook API for the login