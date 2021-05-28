const x = [
    {a: 3, data: '1'},
    {a: 4, data: '2'}
]

// let y = x.find(o => o.a == 5);
// console.log(y);

// if (x.find()) {
//     setData
// }

let id = 3
let idx = -1

let check = x.find((o, i) => {
    console.log('finding', o);
    if (o.a == id) {
        console.log('found')
        return true;
    }
})
console.log('check:', check);
if (!check) {
    console.log('append')
}


    // x.find((o, i) => {
    //     if (o.a == id) {
    //         console.log('found')
    //         return
    //         // let y = data;
    //         // y[i].data = json;
    //         // setData(y)
    //         // let y = o.data
    //         // y[i] = json
    //         // setData(y[i] = json)
    //     }
    //     throw e
    // })

// for ()