//load external Libraries
$(function(){
	
	$("#menu").menuModule();
	var objectHandler = create("div").objectHandlerModule();
	$(".list").listThoughtModule();
	
	var createDialog = create("div").createThoughtModule();
	
//	$(".timeline").timelineModule();
/*	
	//Temp object
	addUser({   _id : {   $oid : "4eccdf4fcc93741aef074361"   },   id : 1,   email : "ulf.davidsson@gmail.com", firstname:"Ulf", lastname:"Davidsson"});
	addUser({   _id : {   $oid : "4eccdf4fcc93741aef074362"   },   id : 2,   email : "daniel.werthen@gmail.com", firstname:"Daniel", lastname:"Werthen"});

	addLinkingType({   _id : {   $oid : "4ercdf4fcc93741arf084361"   },   id : 1, name:"Assosiation"});
	addLinkingType({   _id : {   $oid : "4hjero4fcc93741arf074361"   },   id : 2, name:"Historik"});

	addLinking({   _id : {   $oid : "4ercdf4fcc93741arf074361"   },   id : 1,   user : {id:1}, linkingType: {id:1}, fromObject: {id:1}, toObject: {id:2}, created:'2011-11-23 13:11:00'});
	addLinking({   _id : {   $oid : "4ercdf4fcc93741brf074361"   },   id : 2,   user : {id:2}, linkingType: {id:1}, fromObject: {id:3}, toObject: {id:2}, created:'2011-11-23 13:11:00'});
	addLinking({   _id : {   $oid : "4ercdf4fcc93741crf074361"   },   id : 3,   user : {id:1}, linkingType: {id:2}, fromObject: {id:3}, toObject: {id:1}, created:'2011-11-23 13:11:00'});
	
	addThought({   _id : {   $oid : "4eccdf4fcc93741arf074361"   },   id : 1,   user : {id:1}, title:"test", content:"testcontent",created:'2011-11-03 13:08:05'});
	addThought({   _id : {   $oid : "4ercdf4fcc93741arf074361"   },   id : 2,   user : {id:2}, title:"test2", content:"sddfgsdgnjhseuilioöoisr",created:'2011-11-23 10:18:05'});
	addThought({   _id : {   $oid : "4wertf4fcc93741arf074361"   },   id : 3,   user : {id:1}, title:"test", content:"testcondfsdfsdfsdtentdfg update",created:'2011-11-23 12:00:00'});

*/
});
	