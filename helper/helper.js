const mysql=require ('mysql2');
// const { Connection } = require('mysql2/typings/mysql/lib/Connection');

let connection = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"admin",
    database:"trainingdb2"
  });

connection.connect((err,result)=>{
    if (err){
        throw err;
    }
    else{
        console.log("connected!");
    }
});

const selectData=(data ,callback)=>{
    const select_data=data.select_data;
    const select_table=data.select_table;
    const select_condition=data.select_condition;

    const selectQuery=`SELECT ${select_data} FROM ${select_table} WHERE ${select_condition}`
    connection.query(selectQuery,(err,result)=>{
        if(err){
            throw err;
        }
        else
        {
            callback(result);
        }
    });
};
const insertData=(data,callback)=>{

    const table_name = data.table_name;
    const value = data.values;
    const coloumn_name=data.coloumn_name;
    
    const insertQuery=`INSERT INTO ${table_name}(${coloumn_name}) VALUES(${value})`
    
    connection.query=(insertQuery,(insert_err,inser_result)=>
    {
        if (insert_err) {
            throw insert_err;
        } else {
            callback(1);
        }
    })
}

const fetchBills=(data,callback)=>{
   const bill_select =data.bill_select;
   const bill_table_name =data.bill_table_name;
   const user_table_name = data.user_table_name;
   const sub_query_condtion =data.user_bill_condtion;
   const inner_query_get =data.user_id;
   const fetch_bill_condition =data.fetch_bill_condition;
   const fetch_bill_column_name =data.fetch_bill_column_name;
   const fetch_bill_from =data.fetch_bill_from;
   const fetch_bill_to =data.fetch_bill_to;
   
   const fetchBillQuery = `SELECT ${bill_select} FROM ${bill_table_name} WHERE ${sub_query_condtion}(SELECT ${inner_query_get} FROM ${user_table_name} WHERE ${fetch_bill_condition}) AND ${fetch_bill_column_name} BETWEEN '${fetch_bill_from}' AND '${fetch_bill_to}' ORDER BY ${fetch_bill_column_name} ASC`;

    connection.query(fetchBillQuery,(err,result)=>{
        if(err){
            throw err;
        }
        else{
            callback(result);
        }
    })
}
const subQuery=(data,callBack)=>{
    main_table=data.main_table
    main_column=data.main_column
    main_condition=data.main_condition
    sub_table=data.sub_table
    sub_column=data.sub_column
    sub_condition=data.sub_condition
    const query=`SELECT ${main_column} FROM ${main_table} WHERE ${main_condition} IN (SELECT ${sub_column} FROM ${sub_table} WHERE ${sub_condition})`
    connection.query(query,(err,result)=>{
        if(err){
            throw err
        }else{
            callBack(result)
        }
    })
}
const updateData = (data,callBack)=>{
    const table = data.table;
    const columns = data.columns;
    const condition = data.condition;
    const updateQuery = `UPDATE ${table} SET ${columns} WHERE ${condition}`
    connection.query(updateQuery, (err,result)=>{
        if(err){
            throw err;
        }else{
            callBack(1);
        }
    })
}



module.exports={
    selectData,
    insertData,
    fetchBills,
    subQuery,
    updateData
};