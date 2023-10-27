const path = require("path");
const helper=require("../helper/helper.js");
const { uuid } = require("uuidv4");


const login=(req,res)=>{
    const phone=req.body.phone;
    const password=req.body.password;
    const data={
    select_data:"*",
    select_table:"user_info",
    select_condition:`user_phone=${phone} && user_password=${password}`
    }

    helper.selectData(data,(result)=>{
        if(result.length==1)
        {
            const userid=result[0].user_id;
            const session_data={
                select_data:"*",
                select_table:"session_info",
                select_condition:`user_id=${userid}`
            }

            helper.selectData(session_data,(session)=>
                {
                    if (session.length==1) {
                        const session_id=session[0].session_id;
                        res.send(session_id);
                    }
                    else{
                        if(session.length==0)
                        {
                            const session_id=uuid();
                            const new_data={
                                table_name:"session_info",
                                coloumn_name:"session_id,user_id",
                                values:`"${session_id}",${result[0].user_id}`
                            }
                            helper.insertData(new_data,(success)=>
                            {
                                if(success)
                                {
                                    res.send(session_id);
                                }
                                else
                                {
                                    throw err;
                                }
                            })
                        }
                        else
                        {
                            throw err;
                        }
                    }
                })
        }
        else
        {
            console.log("invalid credentials");
        }

    })
}

const fetchUser=(req,res)=>{
        const session_id=req.body.session_id;
        const fetch_data={
            select_data:"*",
            select_table:"session_info",
            select_condition:`session_id="${session_id}"`
        }
        helper.selectData(fetch_data,(session)=>{
            if (session) {
                const user_id=session[0].user_id
                const session_data={
                    select_data:"*",
                    select_table:"user_info",
                    select_condition:`user_id=${user_id}` 
                }
                helper.selectData(session_data,(fetch_data)=>
                {
                    if(fetch_data){
                        res.send(fetch_data);
                    }
                    else{
                        throw err;
                    }
                })
            }
            else{
                throw err;
            }
        })
}

const fetchBills=(req,res)=>{
    const user_id=req.body.user_id;
    const from_date=req.body.FormData;
    const to_date=req.body.ToData;
    const fetchbill_data={
        bill_select: "*",
        bill_table_name: "bill_info",
        user_bill_condtion: "user_id IN",
        user_table_name: "user_info",
        user_id: "user_id",
        fetch_bill_condition: `user_id=${user_id}`,
        fetch_bill_column_name: "bill_generated_date",
        fetch_bill_from: from_date,
        fetch_bill_to: to_date,
    }
    helper.fetchBills(fetchbill_data,(fetchbill)=>{
       if(fetchbill){
            res.send(fetchbill);
       }
       else{
        throw err;
       }
    })
}

const consumerUserinfo=(req,res)=>{
    const session_id=req.body.session_id;

    const consumerUserinfo_data={
        main_table:'user_info',
        main_column:'*',
        main_condition:'user_id',
        sub_table:'session_info',
        sub_column:'user_id',
        sub_condition:`session_id="${session_id}"`
    }
    helper.subQuery(consumerUserinfo_data,(result)=>{
        if(result.length==1){
            res.send(result)
        }
        else{
            throw err;
        }
    })
   
}
const saveUsers=(req,res)=>{
    const user_name = req.body.user_name;
    const user_phone = req.body.user_phone;
    const user_address = req.body.user_address;
    const user_id = req.body.user_id;
    const saveData = {
        table : 'user_info',
        columns : `user_name="${user_name}",user_phone = ${user_phone},user_address="${user_address}"`,
        condition : `user_id = ${user_id}`
    }
    helper.updateData(saveData, (updateResult)=>{
        if(updateResult){
            res.sendStatus(200);
        }else{
            res.sendStatus(500);
        }
    })
}
const fetchSingleBill = (req, res) => {
    res.render("bill.html");
  };
const displayBill = (req, res) => {
    const bill_id = req.body.billId;
    const displayBill_data = {
        select_data: "*",
        select_table: "user_info u,bill_info b",
        select_condition: `u.user_id=b.user_id and b.bill_id ='${bill_id}'`,
    };
    helper.selectData(displayBill_data, (displayBillResult) => {
      if (displayBillResult.length == 1) {
        res.send(displayBillResult);
      } else {
        console.log("No data found");
        res.sendStatus(500);
      }
    });
  };

  
module.exports={
    login,
    fetchUser,
    fetchBills,
    consumerUserinfo,
    saveUsers,
    fetchSingleBill,
    displayBill
}