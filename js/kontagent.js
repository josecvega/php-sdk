function urlencode( str ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: AJ
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: travc
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Lars Fischer
    // +      input by: Ratheous
    // %          note 1: info on what encoding functions to use from: http://xkr.us/articles/javascript/encode-compare/
    // *     example 1: urlencode('Kevin van Zonneveld!');
    // *     returns 1: 'Kevin+van+Zonneveld%21'
    // *     example 2: urlencode('http://kevin.vanzonneveld.net/');
    // *     returns 2: 'http%3A%2F%2Fkevin.vanzonneveld.net%2F'
    // *     example 3: urlencode('http://www.google.nl/search?q=php.js&ie=utf-8&oe=utf-8&aq=t&rls=com.ubuntu:en-US:unofficial&client=firefox-a');
    // *     returns 3: 'http%3A%2F%2Fwww.google.nl%2Fsearch%3Fq%3Dphp.js%26ie%3Dutf-8%26oe%3Dutf-8%26aq%3Dt%26rls%3Dcom.ubuntu%3Aen-US%3Aunofficial%26client%3Dfirefox-a'

    var hash_map = {}, unicodeStr='', hexEscStr='';
    var ret = (str+'').toString();

    var replacer = function(search, replace, str) {
        var tmp_arr = [];
        tmp_arr = str.split(search);
        return tmp_arr.join(replace);
    };

    // The hash_map is identical to the one in urldecode.
    hash_map["'"]   = '%27';
    hash_map['(']   = '%28';
    hash_map[')']   = '%29';
    hash_map['*']   = '%2A';
    hash_map['~']   = '%7E';
    hash_map['!']   = '%21';
    hash_map['%20'] = '+';
    hash_map['\u00DC'] = '%DC';
    hash_map['\u00FC'] = '%FC';
    hash_map['\u00C4'] = '%D4';
    hash_map['\u00E4'] = '%E4';
    hash_map['\u00D6'] = '%D6';
    hash_map['\u00F6'] = '%F6';
    hash_map['\u00DF'] = '%DF';
    hash_map['\u20AC'] = '%80';
    hash_map['\u0081'] = '%81';
    hash_map['\u201A'] = '%82';
    hash_map['\u0192'] = '%83';
    hash_map['\u201E'] = '%84';
    hash_map['\u2026'] = '%85';
    hash_map['\u2020'] = '%86';
    hash_map['\u2021'] = '%87';
    hash_map['\u02C6'] = '%88';
    hash_map['\u2030'] = '%89';
    hash_map['\u0160'] = '%8A';
    hash_map['\u2039'] = '%8B';
    hash_map['\u0152'] = '%8C';
    hash_map['\u008D'] = '%8D';
    hash_map['\u017D'] = '%8E';
    hash_map['\u008F'] = '%8F';
    hash_map['\u0090'] = '%90';
    hash_map['\u2018'] = '%91';
    hash_map['\u2019'] = '%92';
    hash_map['\u201C'] = '%93';
    hash_map['\u201D'] = '%94';
    hash_map['\u2022'] = '%95';
    hash_map['\u2013'] = '%96';
    hash_map['\u2014'] = '%97';
    hash_map['\u02DC'] = '%98';
    hash_map['\u2122'] = '%99';
    hash_map['\u0161'] = '%9A';
    hash_map['\u203A'] = '%9B';
    hash_map['\u0153'] = '%9C';
    hash_map['\u009D'] = '%9D';
    hash_map['\u017E'] = '%9E';
    hash_map['\u0178'] = '%9F';

    // Begin with encodeURIComponent, which most resembles PHP's encoding functions
    ret = encodeURIComponent(ret);

    for (unicodeStr in hash_map) {
        hexEscStr = hash_map[unicodeStr];
        ret = replacer(unicodeStr, hexEscStr, ret); // Custom replace. No regexing
    }

    // Uppercase for full PHP compatibility
    return ret.replace(/(\%([a-z0-9]{2}))/g, function(full, m1, m2) {
        return "%"+m2.toUpperCase();
    });
}

function parse_str(query_str){
  var r = {};
  if(query_str == undefined || query_str == "")
    return r;

  var key_val_pair_list = query_str.split('&');
  var key_val_pair_list_len = key_val_pair_list.length;
  for(var i = 0 ; i < key_val_pair_list_len; i++)
  {
    var key_val_pair = key_val_pair_list[i];
    var item = key_val_pair.split("=");
    if(item[1] == undefined || item[1] =="")
    {
      r[item[0]] = null;
    }
    else
    {
      r[item[0]] = decodeURIComponent(item[1].replace(/\+/g, '%20'));
    }
  }
  return r;
}

function http_build_query( formdata, numeric_prefix, arg_separator ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Legaev Andrey
    // +   improved by: Michael White (http://getsprink.com)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: stag019
    // -    depends on: urlencode
    // *     example 1: http_build_query({foo: 'bar', php: 'hypertext processor', baz: 'boom', cow: 'milk'}, '', '&amp;');
    // *     returns 1: 'foo=bar&amp;php=hypertext+processor&amp;baz=boom&amp;cow=milk'
    // *     example 2: http_build_query({'php': 'hypertext processor', 0: 'foo', 1: 'bar', 2: 'baz', 3: 'boom', 'cow': 'milk'}, 'myvar_');
    // *     returns 2: 'php=hypertext+processor&myvar_0=foo&myvar_1=bar&myvar_2=baz&myvar_3=boom&cow=milk'

    var value, key, tmp = [];

    var _http_build_query_helper = function (key, val, arg_separator) {
        var k, tmp = [];
        if (val === true) {
            val = "1";
        } else if (val === false) {
            val = "0";
        }
        if (typeof(val) == "array" || typeof(val) == "object") {
            for (k in val) {
                if(val[k] !== null) {
                    tmp.push(_http_build_query_helper(key + "[" + k + "]", val[k], arg_separator));
                }
            }
            return tmp.join(arg_separator);
        } else if(typeof(val) != "function") {
	  if(val != undefined)
	    return urlencode(key) + "=" + urlencode(val);
	  else
	    return undefined;
        }
    };

    if (!arg_separator) {
        arg_separator = "&";
    }
    for (key in formdata) {
        value = formdata[key];
        if (numeric_prefix && !isNaN(key)) {
            key = String(numeric_prefix) + key;
        }
	var key_val_str = _http_build_query_helper(key, value, arg_separator);
	if(key_val_str != undefined)
	  tmp.push(key_val_str);
    }

    return tmp.join(arg_separator);
}

///////////////// Kontagent class /////////////////
console.log("kontagent.js");//xxx

function Kontagent(kt_host, kt_api_key){
  this.kt_api_key = kt_api_key;
  this.kt_host = kt_host;
  this.version = 'v1';
};

Kontagent.prototype = {
  run : function()
  {
    var curr_url = window.location.href;
    var url_items = curr_url.split("?");
    var qs = null;
    if(url_items.length > 1){
      qs = url_items[1];
    }

    if(qs){
      var qs_dict = parse_str(qs);
      if(qs_dict['kt_type'] != undefined){
	switch(qs_dict['kt_type']){
	case 'ins':
	  {
	    try{
	      this.kt_send_msg_via_img_tag(kt_ins_str);
	    }catch(e){ }
	    break;
	  }
	case 'inr':
	  {
	    try{
	      //this.kt_send_msg_via_img_tag(kt_inr_str);
	    }catch(e){ }
	    break;
	  }
	}//switch...
      }//if(qs_dict...
    }//if(qs)...

    try{
      this.kt_send_msg_via_img_tag(kt_inr_str);
      console.log("sending:"+kt_inr_str); //xxx
    }catch(e){
    }
  },

  kt_outbound_msg : function(channel, params)
  {
    var url_path = this.kt_host + "/api/" + this.version + "/" + this.kt_api_key + "/" + channel + "/?" + http_build_query(params);
    this.kt_send_msg_via_img_tag(url_path);
  },

  kt_send_msg_via_img_tag : function(url_path)
  {
    var img = document.createElement('img');
    img.src = url_path;
  },

  track_invite_sent : function(qs_dict)
  {
    var params = {};
    if(qs_dict['kt_ut'] != undefined)  params['u']   = qs_dict['kt_ut'];
    if(qs_dict['kt_uid'] != undefined) params['s']   = qs_dict['kt_uid'];
    if(qs_dict['kt_st1'] != undefined) params['st1'] = qs_dict['kt_st1'];
    if(qs_dict['kt_st2'] != undefined) params['st2'] = qs_dict['kt_st2'];
    if(qs_dict['kt_st3'] != undefined) params['st3'] = qs_dict['kt_st3'];
    if(qs_dict['ids']){
      params['r'] = qs_dict['ids'].join(',');
    }
    this.kt_outbound_msg('ins', params);
  }
};

if(window.KT_API_SERVER && window.KT_API_KEY){
  var kt = new Kontagent(KT_API_SERVER , KT_API_KEY);
  kt.run();
}
