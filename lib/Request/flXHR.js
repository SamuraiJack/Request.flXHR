Class('Request.flXHR', {
    
    BEGIN : function (ready, resource) {
        var flXHRUrl = resource.url.replace(/Request\/flXHR\.js.*/, 'Request/flXHR/static/flXHR.js')
        
        if (!flXHRUrl.match(/^http/i) && !flXHRUrl.match(/^\//)) 
            flXHRUrl = window.location.href.replace(/\?.*$/, '').replace(/\/[^/]*$/, '/') + flXHRUrl
            
        resource.flXHRUrl = flXHRUrl
        
        use('jsurl://' + flXHRUrl, ready)
    },
    
    
    have : {
        req                         : null,
        
        noCacheHeader               : true,
//        passThroughException        : true,
        
        instancePooling             : true
    },
    
    
    methods: {
        
        initialize: function () {
            this.req = new flensed.flXHR({
                noCacheHeader       : this.noCacheHeader,
                
                instancePooling     : this.instancePooling
            })
            
//            this.req.passThroughException = this.passThroughException
        },
        
        

        getText: function (urlOrOptions, callback, scope) {
            var req = this.req
            
            var headers, url, data, user, pwd
            var method = 'GET'
            
            if (typeof urlOrOptions != 'string') {
                method = urlOrOptions.method || method
                data = urlOrOptions.data || null
                headers = urlOrOptions.headers
                url = urlOrOptions.url
                callback = callback || urlOrOptions.callback
                scope = scope || urlOrOptions.scope
                user = urlOrOptions.user
                pwd = urlOrOptions.pwd
            } else url = urlOrOptions
            
            callback = callback || function () {}
            
            req.open(method, url, true, user, pwd)
            
            if (headers) Joose.O.eachOwn(headers, function (value, name) {
                req.setRequestHeader(name, value)
            })
            
            try {
                req.onerror = function (xhr) {
                    callback.call(scope || this, false, xhr)
                }
                
                req.onreadystatechange = function (event) {  
                    if (req.readyState == 4) {  
                        if (req.status == 200 || req.status == 0) 
                            callback.call(scope || this, true, req.responseText)
                        else 
                            callback.call(scope || this, false, "File not found: " + url)
                    }  
                };  
                req.send(data)
            } catch (e) {
                throw "File not found: " + url
            }
            
            return req
        }
        
    }
    
})
