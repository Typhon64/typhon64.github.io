var _____WB$wombat$assign$function_____ = function(name) {return (self._wb_wombat && self._wb_wombat.local_init && self._wb_wombat.local_init(name)) || self[name]; };
if (!self.__WB_pmw) { self.__WB_pmw = function(obj) { this.__WB_source = obj; return this; } }
{
  let window = _____WB$wombat$assign$function_____("window");
  let self = _____WB$wombat$assign$function_____("self");
  let document = _____WB$wombat$assign$function_____("document");
  let location = _____WB$wombat$assign$function_____("location");
  let top = _____WB$wombat$assign$function_____("top");
  let parent = _____WB$wombat$assign$function_____("parent");
  let frames = _____WB$wombat$assign$function_____("frames");
  let opener = _____WB$wombat$assign$function_____("opener");



(function() {
	function getParams(startAttr, speedAttr) {
		let start = 3000;
		let speed = 50;

		let scripts = window.document.getElementsByTagName('script');

		for (let i = 0; i < scripts.length; i++) {
			if (scripts[i].src.indexOf('title-scroll.js') !== -1) {
				if (scripts[i].getAttribute(startAttr) !== null && scripts[i].getAttribute(startAttr) !== "") {
					start = scripts[i].getAttribute(startAttr);
				}

				if (scripts[i].getAttribute(speedAttr) !== null && scripts[i].getAttribute(speedAttr) !== "") {
					speed = scripts[i].getAttribute(speedAttr);
				}

				break;
			}
		}

		return [start, speed];
	}

	window.addEventListener('load', () => {
		let [start, speed] = getParams('data-start', 'data-speed');

		let title = document.title + " --  -- ";
		let i = 0;

		setTimeout(function() {
		    setInterval(function () {
				document.title = title.substr(i, title.length) + title.substr(0, i);
				i = (i + 1) % title.length;
		    }, speed);
		}, start);
	});
})();


}
