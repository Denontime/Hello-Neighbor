import json, sys
data = json.load(sys.stdin)
for item in data:
    print(item['path'])
