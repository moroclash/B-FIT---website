
function validation()
{
    var fname = document.forma.firstname;
    var lname =  document.forma.lastname;
    var passs = document.forma.password;
    var eemail = document.forma.email;
    var age = document.forma.age;
    var city = document.forma.City;
    var phone = document.forma.phone;
    var flage1,flage2,flage3,flage4,flage5,flage6,flage7;
    flage1=letter(fname,"firstname");
    flage2=letter(lname,"lastname");
    flage3=pass(passs,12,8,"password");
    flage4=email(eemail,"email");
    flage5=numper(age,"age");
    if(age<100&&age>6)
        flage5 = true;
    else
        {
        flage7=false;
         red("age");
     }
    flage6=letter(city,"City");
    flage7=numper(phone,"phone");
    if(phone.length!=11)
     {
        flage7=false;
         red("phone");
     }
    else
        flage7=true;
    if(flage1&&flage2&&flage3&&flage4&&flage5&&flage6&&flage7)
        return true;
    else
        return false;
}



function email(email,id)
{
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;  
    if(email.value.match(mailformat))
        {
        whiet(id);
        return true;
        }
        red(id);
    return false;
}


function numper(num,id)
{
    var numper = /^[0-9]+$/
    if(num.value.match(numper))
        {
        whiet(id);
        return true;
        }
        red(id);
        return false;
}

function letter(name,id)
{
    var letter = /^[A-Za-z]+$/;
    if(name.value.match(letter))
        {
        whiet(id);
        return true;
        }
        red(id);
    return false;
}

function pass(name,max,min,id)
{
    var num = name.value.length;
    if(num==0||num>max||num<min)
        {
            red(id);
            return false;
        }
    whiet(id);
    return true;
}

function red(id)
{
      document.getElementById(id).style.borderColor = "red";
}

function whiet(id)
{
      document.getElementById(id).style.borderColor = "white";
}


