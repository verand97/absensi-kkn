const fs = require('fs');

const raw = JSON.parse(fs.readFileSync('parsed_data.json', 'utf8'));

const members = raw.slice(1).map(row => {
  return {
    name: row['__EMPTY_1'],
    nim: row['__EMPTY_2']
  };
}).filter(m => m.name && m.nim);

fs.writeFileSync('members.json', JSON.stringify(members, null, 2));
console.log('Created members.json');
