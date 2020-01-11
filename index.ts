const express = require('express');
const app = express();

import { MessageReader } from './msg-reader';





app.get('/', function(req: any, res: any){
    res.sendFile(__dirname + '/index.html');
    const mr3000 = new MessageReader(3000, "exchange", "amqp://user:bitnami@localhost", "fromAtoB", "fromBtoA");
    // const mr8080 = new MessageReader(8080, "exchange", "amqp://user:bitnami@localhost", "fromBtoA", "fromAtoB");
    mr3000.run();
    // mr8080.run();
});



app.listen(3000, () => {
    console.log(`Server is listening on 3000`);
    
});



