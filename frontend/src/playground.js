// const data = [
//     {id: 0, data: 'data1'},
//     {id: 1, data: 'data2'}
// ]

// let dupe = 'data1 updated';
// let append = 'data3';

// let newData = data;

// let json = dupe;
// let id = 0;
// let entry = newData.find(e => e.id == id);
// if (entry) entry.data = json;
// else newData.push({id: id, data: json});

// json = append;
// id = 2;
// entry = newData.find(o => o.id == id);
// if (entry) entry.data = json
// else newData.push({id: id, data: json});

// console.log('newData:', newData);

// Expected newData: 
// [ { id: 0, data: 'data1 updated' }, { id: 1, data: 'data2' }, { id: 2, data: 'data3' } ]

let str = 'sql';
str = str.replace(/sql/g, 'SQL');
console.log(str);
