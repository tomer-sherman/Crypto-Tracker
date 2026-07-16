
Home component plan overview:



HOME  PAGE!!!
Data fetching explained:
1. RENDERING HOME COMPONENTS:
A. Fetching data from the BIG 100 LINK(Spinner on screen Till the data is fully fetched.).
B. Storing all this data in the global state inside the crypToCoin slice.
C. Data is shown as a list of cards, IN each card Different stats and a more info button.

D.Pressing the more info - will fetch more data with a skelton loader, from another specific coin api.
E. Storing this specific coin data in the global state inside a SpecificCoin slice.
B. Showing the data on the screen.


* Implementing for each useEffect inside the components, too check wether the data exists in the global state if yes ==> load it back up. If no ==> fetch the data from the server again.

2. 100 CARDS PAGINATION:


