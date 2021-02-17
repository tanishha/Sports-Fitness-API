module.exports=function(obj1,obj2){
    if (obj2.name)
   obj1.name = obj2.name
if (obj2.username)
   obj1.username = obj2.username
if (obj2.password)
   obj1.password = obj2.password
if (obj2.email)
   obj1.email = obj2.email
if (obj2.activeStatus)
   obj1.status = true
if (obj2.inActiveStatus)
   obj1.status = false
if (obj2.role)
   obj1.role = obj2.role
if (obj2.phoneNumber)
   obj1.phoneNumber = obj2.phoneNumber
return obj1
}