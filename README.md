# Heartbeat-Watch
It measures the heartbeat rate from an Apple smartwatch, via the [Health Data Server app](https://apps.apple.com/us/app/health-data-server/id1496042074), and saves it to a [MongoDB Compass database](https://www.mongodb.com/products/compass). It is coded in JavaScript with [Node.js](https://nodejs.org/en/).

The equipments utilized in this project are the [Meta Oculus Quest 2](https://store.facebook.com/quest/products/quest-2/?utm_source=adwords&utm_campaign=responsive), [bHaptics Tactsuit x40 Haptic Vest](https://www.bhaptics.com/tactsuit/tactsuit-x40) and an [Apple Watch Series 6](https://www.apple.com/lae/apple-watch-series-6/).

It is for the [**Green Health**](https://cedri.ipb.pt/communication/news/greenhealth-project---digital-strategies-based-on-biological-assets-to-improve-well-being-and-promote-green-health.) project that has been carried out by the [**Instituto Politécnico de Bragança (IPB)**](https://portal3.ipb.pt/index.php/pt/ipb) - Portugal.

We are reachable by the following e-mail address:
```
greenhealthscholarship@gmail.com
```
___________________________________________
### Node.js project
To use the application, follow these steps:

1. Clone this repository (run the commands by using [GitHub Desktop](https://desktop.github.com/), [GitKraken](https://www.gitkraken.com/), [Git Bash](https://git-scm.com/downloads), terminal, or a similar program):
```
git clone https://github.com/GreenHealthScholarship/Virtual-Metro-Scenario-for-Mental-Health-Rehabilitation.git
```

2. Go to the "Virtual-Metro-Scenario-for-Mental-Health-Rehabilitation" folder:
```
cd Virtual-Metro-Scenario-for-Mental-Health-Rehabilitation/
```

3. Checkout to the "database-communication" branch:
```
git checkout database-communication
```

4. Go to the "client_ws" folder:
```
cd Assets/Heartbeat-Watch/client_ws/
```

5. Sign in to [MongoDB Compass database](https://www.mongodb.com/products/compass) (do not forget to add the computer IP address in *Network Access* in *SECURITY* menu, otherwise it will not connect with the database).

6. Using a code editor (as [Visual Studio Code](https://code.visualstudio.com/)), take the link of the cluster, that is supposed to save the data, from [MongoDB Compass database](https://www.mongodb.com/products/compass) and insert in the constant *uri* in the *index.js* file code (make sure the password is correct in the link).

7. Take the database and collection names from [MongoDB Compass database](https://www.mongodb.com/products/compass) and insert in the constant *collection*, in the *index.js* file code, in their respective places.

8. Using a terminal ([Visual Studio Code](https://code.visualstudio.com/) terminal can also be used), make sure these packages are installed:
```
npm install -g npm
npm install node
npm install ws
npm install fs
npm install console
npm install mongodb
```
9. Run the command below and note the IPv4 Address:
```
ipconfig
```
10. Insert the IPv4 in the *IP ADDRESS* field in the [Health Data Server app](https://apps.apple.com/us/app/health-data-server/id1496042074)(make sure the phone has connection with internet and the watch).

11. Run the *index.js* application:
```
node index.js
```
12. When the message appears in the terminal, make sure to be wearing the watch and press the start button in the watch app.

13. When the message appears in the terminal, insert the user's name.

14. The program will take the heartbeat rates until the stop button in the watch app is pressed. Also, finish the program running in terminal.
It is possible to see the data in real-time, by pressing the refreshing button, in the collection in MongoDB.