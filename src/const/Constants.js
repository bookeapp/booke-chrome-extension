export const VIEWS = {
  MAIN: "main",
  DASHBOARD: "dashboard"
};

const DEFAULT_INDENT = 16;

const MAIN_VIEW_HEIGHT = 60;

const XERO_HEADER_HEIGHT = 170;

export const STORAGE_NAME = "booke_ai_extension";

export const TOP_INDENT = XERO_HEADER_HEIGHT + DEFAULT_INDENT;

export const BOTTOM_INDENT = MAIN_VIEW_HEIGHT + DEFAULT_INDENT;

export const PROCENTS = 100;

export const FIND_MATCHES_INTERVAL = 1000;

export const API_CHECK_INTERVAL = 10000;

// eslint-disable-next-line max-len
export const LOGO_IMG_DATA_URI = "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNzQgMTAwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48Y2xpcFBhdGggaWQ9ImIiPjx1c2UgeGxpbms6aHJlZj0iI2EiLz48cGF0aCBpZD0iYSIgZD0iTTAgMGg3NHYxMDBIMFYweiIvPjwvY2xpcFBhdGg+PGcgc3R5bGU9ImNsaXAtcGF0aDp1cmwoI2IpIj48bGluZWFyR3JhZGllbnQgeDE9IjEzLjU5NTUiIHkxPSIyMC40NjY4IiB4Mj0iNDQuMDUxNCIgeTI9IjkyLjM2OTEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiBpZD0iZCI+PHN0b3Agc3R5bGU9InN0b3AtY29sb3I6IzMxZDg5MjtzdG9wLW9wYWNpdHk6MSIvPjxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IzUwZWFhOTtzdG9wLW9wYWNpdHk6MSIvPjwvbGluZWFyR3JhZGllbnQ+PGRlZnM+PGcgaWQ9ImUiPjxkZWZzPjxwYXRoIGlkPSJjIiBkPSJNMTQuNTExNyAyNC44NTY3djUwLjE1ODZMMCA4OS41NzkyVjBoMTAuMjU1N2wxNC41MTE2IDE0LjU2NCAyNS4wMDM5IDI1LjA2NDMtMTAuMjg1NCAxMC4zMjI1LTI0Ljk3NDEtMjUuMDk0MXptMzUuMjU5NSAzNS4zODdMNjAuMDI3IDQ5Ljk1MDhsNi4zODM4IDYuNDA3MmM3LjM4OSA3LjQxNTMgOS41MTY4IDE4LjA5MzggNS40OTc0IDI3Ljc5MzItMy45OTAxIDkuNzI5My0xMy4wMDQ1IDE1Ljc1MDQtMjMuNDY3MSAxNS43NTA0SDEwLjI4NTNsMTQuNTExNi0xNC41NjM4aDIzLjY0NDJjNC41NTE3IDAgOC4zMzQ4LTIuNTIxNSAxMC4wNzgzLTYuNzYzMiAxLjc0MzktNC4yMTE3Ljg1NzItOC42OTA5LTIuMzY0NC0xMS45MjQxbC02LjM4MzgtNi40MDY4eiIvPjwvZGVmcz48dXNlIHhsaW5rOmhyZWY9IiNjIiBzdHlsZT0iZmlsbDp1cmwoI2QpO2ZpbGwtb3BhY2l0eToxO2ZpbGwtcnVsZTpub256ZXJvO29wYWNpdHk6MTtzdHJva2U6bm9uZSIvPjwvZz48L2RlZnM+PHVzZSB4bGluazpocmVmPSIjZSIvPjxsaW5lYXJHcmFkaWVudCB4MT0iMTguMzI0MyIgeTE9IjgwLjM4NCIgeDI9IjYyLjA0NTQiIHkyPSIxOC4wNzkxIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgaWQ9ImciPjxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiMwMjY3ZDQ7c3RvcC1vcGFjaXR5OjEiLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiMzOTgwZmY7c3RvcC1vcGFjaXR5OjEiLz48L2xpbmVhckdyYWRpZW50PjxkZWZzPjxnIGlkPSJoIj48ZGVmcz48cGF0aCBpZD0iZiIgZD0ibTQ0LjUzOTkgNjUuNDYzOCA1LjIzMTMtNS4yNTAxTDYwLjAyNyA0OS45MjEybDYuMzgzOC02LjQwNzJjNy40MTg1LTcuNDQ0OSA5LjUxNjgtMTguMDkzNyA1LjQ5NzQtMjcuNzkzMkM2Ny44ODg1IDYuMDIxMzcgNTguOTAzNyAwIDQ4LjQxMTYgMEgxMC4yNTU3bDE0LjUxMTYgMTQuNTY0aDIzLjY0NDNjNC41NTE2IDAgOC4zMzQ3IDIuNTIxMyAxMC4wNzgzIDYuNzYzIDEuNzQzOCA0LjI0MTYuODU3MSA4LjY5MDktMi4zNjQ1IDExLjkyNDFsLTYuMzgzOCA2LjQwNjktMTAuMjU1OCAxMC4yOTI4LTUuMjAxNyA1LjIyMDUtMTkuNzcyNCAxOS44NDRMMCA4OS41NzkyVjk5Ljg3MkgxMC4yNTU3bDE0LjUxMTYtMTQuNTY0MiAxOS43NzI2LTE5Ljg0NHoiLz48L2RlZnM+PHVzZSB4bGluazpocmVmPSIjZiIgc3R5bGU9ImZpbGw6dXJsKCNnKTtmaWxsLW9wYWNpdHk6MTtmaWxsLXJ1bGU6ZXZlbm9kZDtvcGFjaXR5OjE7c3Ryb2tlOm5vbmUiLz48L2c+PC9kZWZzPjx1c2UgeGxpbms6aHJlZj0iI2giLz48L2c+PGNsaXBQYXRoIGlkPSJqIj48dXNlIHhsaW5rOmhyZWY9IiNpIi8+PHBhdGggaWQ9ImkiIGQ9Ik0wIDBoNzR2MTAwSDBWMHoiLz48L2NsaXBQYXRoPjwvc3ZnPg==";
