### Live Sports BroadCasting 
> This backend system is from a tutorial by javascript mastery on the crash course websockets
- The project involves a deep dive in using websocket serve for real time updates for matches and commentaries

### Cloning the repository
```bash
 git clone https://
```

### Installing the necessarly dependencies 

```bash
npm install
```


### Running the Project

```bash
npm run
```
### Testing the ws server to see it's action 
- 1. You can postman or thunderclient to test the project and see the ws in action

```bash
wscat -c ws://localhost:5000/ws
```

- 2. Add sample data to see the ws magic
- http://localhost:5000/matches
```json
{
  "sport": "Soccer",
  "homeTeamm":"City ",
  "awayTeam": "Arsenal",
  "startTime": "2026-05-21T20:46:00.000z",
  "endTime": "2026-05-21T21:46:00.000z",
}

```

### Adding commentary to a match through mathId
> http://localhost:5000/commentary/1
```json
{
  "minute": 80,
  "sequence":120,
  "period": "2nd Half",
  "eventType": "Save",
  "actor": "Raya",
  "team": "Arsenal",
  "message": "What a save! from david Raya",
  "metaData": {"save": "raya"},
  "tags": ["savel", "shot"]
}
```
