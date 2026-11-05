"""Headless smoke test of the built page. Needs: npm install, pip install playwright.
CDN scripts are served from node_modules so the test runs offline."""
import asyncio, os
from playwright.async_api import async_playwright
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__))); NM=os.path.join(ROOT,'node_modules')
async def main():
    async with async_playwright() as p:
        b=await p.chromium.launch(); pg=await b.new_page(viewport={'width':1280,'height':900})
        await pg.route('**/d3.min.js',lambda r: r.fulfill(path=os.path.join(NM,'d3/dist/d3.min.js'),content_type='application/javascript'))
        await pg.route('**/topojson.min.js',lambda r: r.fulfill(path=os.path.join(NM,'topojson/dist/topojson.min.js'),content_type='application/javascript'))
        errs=[]; pg.on('pageerror',lambda e: errs.append(str(e)))
        await pg.goto('file://'+os.path.join(ROOT,'index.html'))
        await pg.wait_for_function("document.getElementById('mcstat').textContent.includes('秒')",timeout=30000)
        print('verdict:', (await pg.inner_text('#verdict'))[:120])
        print('monte carlo:', await pg.inner_text('#mcstat'))
        await pg.select_option('#nukeMode','ignore'); await pg.check('#chem'); await pg.wait_for_timeout(300)
        print('no-nuclear + chem:', (await pg.inner_text('#verdict'))[:120])
        await pg.set_viewport_size({'width':390,'height':844}); await pg.wait_for_timeout(200)
        sw=await pg.evaluate('document.documentElement.scrollWidth')
        assert sw<=390, f'horizontal overflow on phone width: {sw}px'
        assert not errs, errs
        print('ok'); await b.close()
asyncio.run(main())
