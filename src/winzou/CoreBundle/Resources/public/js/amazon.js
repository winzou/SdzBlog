(function(){
{
    var amazon_retail_url       = "www.amazon.fr";
    var amazon_impression_url   = "www.assoc-amazon.fr";
    var amazon_popover_org      = "8";
    var amazoncomlist = "ca|cn|de|fr|co.uk|co.jp|com";

    function amazon_impression_campaign(code){
    switch(code){
            default:return "2522";

        }
    }
    var amazon_impression_ccmids =  {
            "-as2":"9498",
"ur2":"9498",
"am2":"9482",
"as3":"9474",
"am3":"9478",
"-am2":"9498",
"as2":"8066"
    };
    var orgUnit = {
        	"ca":"15",
	"cn":"28",
	"de":"3",
	"fr":"8",
	"co.uk":"2",
	"co.jp":"9",
	"com":"1"
    };

    var impression_recorders = {
        	"ca":"www.assoc-amazon.ca",
	"cn":"www.assoc-amazon.cn",
	"de":"www.assoc-amazon.de",
	"fr":"www.assoc-amazon.fr",
	"co.uk":"www.assoc-amazon.co.uk",
	"co.jp":"www.assoc-amazon.jp",
	"com":"www.assoc-amazon.com"
    };

    // Script will bail out after this many milliseconds.
    var timeout = 2000;

    var start = new Date();
    start = start.getTime();
    var redirect = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" +amazoncomlist +")/(exec/obidos|o)/redirect", "i");
    var asin     = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" +amazoncomlist +")/(exec/obidos|o)/ASIN\\d?/\\w{10}/(ref=[\\w]+/)?([^/?]+)", "i");
    var product  = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" + amazoncomlist +")/(gp/(product|offer-listing)|([^/]+/)?dp)/\\w{10}(/ref=[\\w]+)?/?\\?([^/?]+)", "i");
    var isbn     = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" + amazoncomlist +")/(exec/obidos|o)/ISBN=\\w{10}/(ref=[\\w]+/)?([^/?]+)A", "i");
    var mp       = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" + amazoncomlist +")/gp/associates/link-types/marketplace", "i");
    var mn        = new RegExp("^http://(www|[\\w\\-\\.]+)\\.amazon\\.(" + amazoncomlist +")/mn/detailApp", "i");
    var allLinks = document.getElementsByTagName('a');
    var imp = {};


    var timeoutReached = false;

    // Do not decorate links in unsupported browsers
    var amazonTreatment = false;
    var agent = new String(navigator.userAgent);
    if (agent.match(/(MSIE.*Windows|Firefox|Netscape|Windows.*Gecko|Safari\/)/))
    {
        amazonTreatment = true;
    }

    window.amazonLinkList = new Array;

    for (var i=0; i < allLinks.length; i++)
    {
        // Check if it's an Amazon redirect link
        var href = new String(allLinks[i].href);
        var results;
        var tag_match;
        
        var doPopover = false;

        if (((results = href.match(redirect)) || (results = href.match(product)))
            && (tag_match = href.match(/tag=([^&]+)/)))
        {
            var locale      = results[2];
            if(locale == "com" && amazon_popover_org != "1")
            {
                // This is a clear Pre prod / Devo case
                // We need to get the locale name from the url....
                locale = results[1].match("[\\w]+");
                 for (var key in orgUnit)
                 {
                    b = key.match(locale);
                    if(b != null)
                    {
                         locale = key;
                         break;
                    }
                }
            }
            var org         = orgUnit[locale];
            var tag         = tag_match[1];
            
            doPopover       = amazonTreatment && (amazon_popover_org == org);

            // Change link code to impression-tracked version
            if (href.match(/link_code=asn/))
            {
                var code = (doPopover) ? 'as3' : 'as2';
                href = href.replace(/link_code=asn/, 'link_code=' + code);
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, code);
            }
            else if (href.match(/link_code=asm/))
            {
                var code = (doPopover) ? 'am3' : 'am2';
                href = href.replace(/link_code=asm/, 'link_code=' + code);
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, code);
            }
            else if (href.match(/link_code=ure/))
            {
                href = href.replace(/link_code=ure/, 'link_code=ur2');
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, 'ur2');
            }
            else if (href.match(/linkCode=bil/) || href.match(/linkCode=btl/))
            {
        code = href.match(/linkCode=bil/)? 'bil':'btl';
                href = href.replace(/linkCode=.../, 'link_code=' + code);
                allLinks[i].href = amazon_InsertCCMID(href, code);
        }   
            else if (href.match(/link(C|_c)ode=as2/))
            {
                // Existing as2 link
                var code = 'as2';
                if (doPopover)
                {
                    code = 'as3';
                    href = href.replace(/link(C|_c)ode=as2/, 'link_code=as3');
                }
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, code);
                imp = amazon_logImpression(imp, locale, tag, '-as2', -1);
            }
            else if (href.match(/link(C|_c)ode=am2/))
            {
                // Existing am2 link
                var code = 'am2';
                if (doPopover)
                {
                    code = 'am3';
                    href = href.replace(/link(C|_c)ode=am2/, 'link_code=am3');
                }
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, code);
                imp = amazon_logImpression(imp, locale, tag, '-am2', -1);
            }

            else if (!href.match(/link_code=/))
            {
                code = (doPopover && href.match(/\/(gp\/product|dp)\/\w{10}/)) ? 
                        'as3' : 'ur2';
                code = (doPopover && href.match(/\/offer-listing\/\w{10}/)) ? 
                        'am3' : code;
                href = href + '&link_code=' + code;
                allLinks[i].href = amazon_InsertCCMID(href, code);
                imp = amazon_logImpression(imp, locale, tag, 'ur2');
            }
        }
        // Check if it's an old-style ASIN link
        else if (results = href.match(asin))
        {
            var locale      = results[2];
            var org         = orgUnit[locale];
            doPopover       = amazonTreatment && (amazon_popover_org == org);
            var code        = (doPopover) ? 'as3' : 'as2';

            // Replace ASIN handler with new version
            href = href.replace(
                    /(exec\/obidos|o)\/ASIN\d?\/(\w{10})(\/ref=nosim)?\/([^\/\?]+)(\/ref=nosim)?.*/i, 
                    'dp/$2$3$5?tag=$4&link_code=' + code + '&creativeASIN=$2');
            allLinks[i].href = amazon_InsertCCMID(href, code);
            var tag = results[4];
            imp = amazon_logImpression(imp, locale, tag, code);
        }
        // Check if it's a really-old-style ISBN link
        else if (results = href.match(isbn))
        {
            var locale      = results[2];
            var org         = orgUnit[locale];
            doPopover       = amazonTreatment && (amazon_popover_org == org);
        var code        = (doPopover) ? 'as3' : 'as2';

            // Replace ISBN handler with new version
            href = href.replace(
                    /(exec\/obidos|o)\/ISBN=(\w{10})(\/ref=nosim)?\/([^\/\?]+)A(\/ref=nosim)?.*/, 
                    'dp/$2$3$5?tag=$4&link_code=' + code + '&creativeASIN=$2');
            allLinks[i].href = amazon_InsertCCMID(href, code);
            var tag = results[4];
            imp = amazon_logImpression(imp, locale, tag, code);
        }
        // Check if it's an old-style marketplace link
        else if ((results = href.match(mp))
                    && (tag_match = href.match(/[?&]t=([^&]+)/)))
        {
            var locale      = results[2];
            var org         = orgUnit[locale];
            var tag         = tag_match[1];
            doPopover       = amazonTreatment && (amazon_popover_org == org);
        var code        = (doPopover) ? 'am3' : 'am2';

            // Replace marketplace handler with new version
            var mpTarget = new RegExp('/gp/associates/link-types/marketplace\\.html\\?asin=(\\w{10})&(amp;)?t=([^/]+)');
            href = href.replace(mpTarget, 
                    '/gp/offer-listing/$1?tag=$3&link_code=' + code 
                        + '&creativeASIN=$1');

            var mpTarget = new RegExp('/gp/associates/link-types/marketplace\\.html\\?t=([^&]+)&(amp;)?asin=(\\w{10})');
            href = href.replace(mpTarget, 
                    '/gp/offer-listing/$3?tag=$1&link_code=' + code 
                        + '&creativeASIN=$3');

            allLinks[i].href = amazon_InsertCCMID(href, code);
            imp = amazon_logImpression(imp, locale, tag, code);
        }
        //Check if it is a China old style link
         else if((results = href.match(mn)))
         {
            var locale      = results[2];
            if(locale == "com" && results[1] !="www")           {
                    locale = results[1].match("[\\w]+");
            }
            var org         = orgUnit[locale];
            doPopover       = amazonTreatment && (amazon_popover_org == org);
            var code        = (doPopover) ? 'as3' : 'as2';
            href = href.replace(/linkCode=as2/, 'link_code=' + code);
            allLinks[i].href = amazon_InsertCCMID(href, code);
            tag_match = href.match(/tag=([^&]+)/);
            var tag=tag_match[1];
            imp = amazon_logImpression(imp, locale, tag, code);
        }
        

        if (doPopover)
        {
            amazon_enhanceLink(allLinks[i]);
        }

        // Have we gone over our time limit?
        var now = new Date();
        now = now.getTime();
        if (now > (start + timeout))
        {
            timeoutReached = true;
            break;
        }
    }

    var tagID;
    var scripts = document.getElementsByTagName('script');
    for (var i=0; i < scripts.length; i++)
    {
        var source = new String(scripts[i].src);
        var tagIDObj;
        if (tagIDObj = source.match(/link-enhancer.*[&?]tag=([^&]+)/))
        {
            tagID = tagIDObj[1];
            break;
        }
    }



    if (amazonTreatment)
    {
        document.write('<scr' + 'ipt type="text/javascript" src="'+window.location.protocol+'//'
                + amazon_retail_url + 
                '/gp/associates/previews/bootstrap.html?assoc_tag=' 
                + tagID + '" charset="utf-8"></scr' + 'ipt>');
    }

    var total = 0;

    // Send data to impression recorder via img tags
    for (var locale in imp)
    {
        var impression_recorder = impression_recorders[locale];

        for (var tag in imp[locale])
        {
            // Record the fact that this script was served.
            var tc = (amazonTreatment) ? 'pv3' : 'pv2';
            document.write('<img src="'+window.location.protocol+'//' 
                + impression_recorder + '/e/ir' +
                  '?l=' + tc +
                  '&t=' + tag +
                  '&o=' + orgUnit[locale] + '" />');

            for (var code in imp[locale][tag])
            {
                var link_code = new String(code);
                link_code = link_code.replace(/^-/, '');
                document.write('<img src="'+window.location.protocol+'//' 
                        + impression_recorder + '/e/ir' +
                      '?t=' + tag +
                      '&l=' + link_code +
                      '&o=' + orgUnit[locale] +
                      '&creative=' + amazon_impression_ccmids[code] +
                      '&camp=' + amazon_impression_campaign(code) +
                      '&i=' + imp[locale][tag][code] + '" />');

                total += imp[locale][tag][code];
            }
        }
    }

    if (timeoutReached)
    {
        document.write('<img src="'+window.location.protocol+'//'
                + amazon_impression_url + '/e/ir?t=' + tagID 
                + '&l=to0&o=' + orgUnit[locale] + '&i=' + total + '" />');
    }
}

function amazon_InsertCCMID(href,code)
{
    if(href.match(/creative=/))
    {
        href = href.replace(/creative=(\d+)?/, 
                'creative=' + amazon_impression_ccmids[code]);
    }
    else
    {
        href = href + '&creative=' + amazon_impression_ccmids[code];
    }

    if(href.match(/camp=/))
    {
        href = href.replace(/camp=(\d+)?/, 
                'camp=' + amazon_impression_campaign(code));
    }
    else
    {
        href = href + '&camp=' + amazon_impression_campaign(code);
    }

    return href;
}

function amazon_logImpression(imp, locale, tag, code, count)
{
    if (!count)
    {
        count = 1;
    }

    if (imp[locale])
    {
        if (imp[locale][tag])
        {
            if (imp[locale][tag][code])
            {
                imp[locale][tag][code] = imp[locale][tag][code] + count;
            }
            else
            {
                imp[locale][tag][code] = count;
            }
        }
        else
        {
            imp[locale][tag] = {};
            imp[locale][tag][code] = count;
        }
    }
    else
    {
        imp[locale] = {};
        imp[locale][tag] = {};
        imp[locale][tag][code] = count;
    }

    return imp;
}


// Attach product data to the link
function amazon_enhanceLink(link)
{
    if (!link.name)
    {
        if (link.href.match(redirect) || link.href.match(product) ||  link.href.match(mn))
        {
            // Capture ASIN from link
            var href = new String(link.href);
            var results = href.match(/(ASIN|product|dp)\/(\w{10})/);
            if (!results)
            {
                results = href.match(/(offering\/list\/-|offer-listing)\/(\w{10})/);
            }
            //China's mn/detailApp case
            if(!results)
            {
                 results = href.match(/(asin)=(\w{10})/);
            }
            if (results)
            {
                if (href.match(/link(C|_c)ode=as3/))
                {
                    window.amazonLinkList.push({'obj':link,'asin':results[2],'linkCode':'as3'});
                }
                else if (href.match(/link(C|_c)ode=am3/))
                {
                    window.amazonLinkList.push({'obj':link,'asin':results[2],'linkCode':'am3'});
                }
                else if (href.match(/link(C|_c)ode=bil/))
                {
                    window.amazonLinkList.push({'obj':link,'asin':results[2],'linkCode':'bil', 
                        'creative': amazon_impression_ccmids['bil'], 'camp': amazon_impression_campaign('bil')});
        }
                else if (href.match(/link(C|_c)ode=btl/))
                {
                    window.amazonLinkList.push({'obj':link,'asin':results[2],'linkCode':'btl', 
                        'creative': amazon_impression_ccmids['btl'], 'camp': amazon_impression_campaign('btl')});
        }
            }
        }
    }
}
})();
