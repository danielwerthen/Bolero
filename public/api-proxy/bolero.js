$(function () {
	$.ajax({
        type: 'POST',
        url: 'http://localhost:8888/login',
        data: { username: 'danielwerthen', password: '123456' },
        datatype: 'application/json',
        success: function(data) {
          if (data.authorized === true) {
						$.getJSON("http://localhost:8888/api/getthoughts?callback=?", function(data) {
							alert(JSON.stringify(data));
						});
						$.ajax({
							type: 'GET',
							url: 'http://localhost:8888/api/getthoughts',
							success: function(data) {
								alert(JSON.stringifiy(data));
							}
						});
          }
          else {
          	alert('not authorized');
          }
        }
      });
});