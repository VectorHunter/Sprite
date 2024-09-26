const MapUnit = 32
const button = {
	LEFT  : 37,
	UP    : 38,
	RIGHT : 39,
	DOWN  : 40,
	START : 13,
	A     : 90,
	B     : 88,
	C     : 67,
	X     : 65,
	Y     : 83,
	Z     : 68,
	L     : 81,
	R     : 69
}
const clr_=(e)=>{
	e = null
}
const spawn=(id_obj,where)=>{
	switch(id_obj)
	{
		case 0:
		break
		
		case 1:
		break
		
		default:
	}
}

var eventkey = []
onkeydown = (e) => {
	eventkey[e.which] = 1
	//console.log(e.key,e.which)
}
onkeyup = (e) => {
	eventkey[e.which] = 0
}
class sprite {
	#texture
	#animation
	#cut
	#vflag
	constructor(url)
	{
		this.#texture = new Image()
		this.#texture.src = url
		this.position = {
			ax: 0,
			ay: 0,
			az: 0,
			aw: 0,
			ah: 0
		}
		this.#animation = {
			frame: 0,
			index: 0
		}
		this.#cut = {
			x: 0,
			y: 0,
			w: this.#texture.width,
			h: this.#texture.height
		}
		this.#vflag = true
		this.customrender = false
	}
	setTexture(_src)
	{
		this.#texture.src = _src
	}
	setSize(w,h,e)
	{
		switch(e)
		{
			case 0:
				this.position.aw = w
				this.position.ah = h
				this.#cut.w = w
				this.#cut.h = h
			break
			case 1:
				this.#cut.w = w
				this.#cut.h = h
			break
			case 2:
				this.position.aw = w
				this.position.ah = h
		}
	}
	setVerticalposition(y,addictive)
	{
		if(addictive)
			this.position.ay+=y
		else
			this.position.ay=y
	}
	setHorizontalposition(x,addictive)
	{
		if(addictive)
			this.position.ax+=x
		else
			this.position.ax=x
	}
	setObjPosition(e)
	{
		this.position = e.hasOwnProperty("ax" && "ay" && "az" && "aw" && "ah")? e : {
			ax: 0,
			ay: 0,
			az: 0,
			aw: 0,
			ah: 0
		}
	}
	setPosition(x,y,addictive)
	{
		if(addictive)
		{
			this.position.ax += x
			this.position.ay += y
		}
		else
		{
			this.position.ax= x
			this.position.ay= y
		}
	}
	getPosition()
	{
		return this.position
	}
	animate(arrx,y_index,ticks)
	{
		this.#cut.x = arrx[this.#animation.index] * this.#cut.w
		this.#cut.y = y_index * this.#cut.h
		this.#animation.frame++
		if(this.#animation.frame > ticks)
		{
			this.#animation.frame = 0
			this.#animation.index++
			if(this.#animation.index > arrx.length - 1)
			{
				this.#animation.index = 0
			}
		}
	}
	draw()
	{
		if(this.#vflag && true)
		{
			ctx.drawImage(this.#texture,this.#cut.x,this.#cut.y,this.#cut.w,this.#cut.h,this.position.ax,this.position.ay,this.position.aw,this.position.ah)
		}
	}
}
class thisactor extends sprite {
	#boolflags
	constructor(source,hitbox)
	{
		super(source)
		this.velocity = {
			vertical: 0,
			horizontal: 0
		}
		this.rect = {
			ox: hitbox.hx,
			oy: hitbox.hy,
			x: 0,
			y: 0,
			w: hitbox.hw,
			h: hitbox.hh
		}
		this.#boolflags = {
			active: true,
			solid: true,
			fall: true,
			clip: true,
			drift: true
		}
		this.state = {
			onground: 0,
			touchingwall: 0,
			touchingceil: 0,
			isfalling: 0
		}
		this.timer = null
		this.friction = 0.1
		
	}
	collision(e)
	{
		const l1 = this.rect, l2 = e.rect
		var cx,cy
		if(this.#boolflags.solid)
		{
			cx = l1.x + l1.w > l2.x && l1.x < l2.x + l2.w
			cy = l1.y + l1.h > l2.y && l1.y < l2.y + l2.h
			return {
				'_default': cx && cy
			}
		}
	}
	fall(pMapcoll)
	{
		const
		maxvspeed = 12,
		midvspeed = 0.5,
		foot = parseUnit(this.rect.y+this.rect.h+this.velocity.vertical),
		onair = (pMapcoll[foot][parseUnit(this.rect.x)] || pMapcoll[foot][parseUnit(this.rect.x + this.rect.w)])
		if(onair == 0)
		{
			this.velocity.vertical = Math.min(this.velocity.vertical+midvspeed,maxvspeed)
			this.state.onground = 0
		}
		else
		{
			super.setVerticalposition(Unparse(foot)-this.rect.h,false)
			this.velocity.vertical = 0
			this.state.onground = 1
		}
		if(pMapcoll[parseUnit(this.rect.y)][parseUnit(this.rect.x)] || pMapcoll[parseUnit(this.rect.y)][parseUnit(this.rect.x+this.rect.w)] == 1)
		{
			this.velocity.vertical = maxvspeed
		}		
	}
	wallcollision(pMapcoll)
	{
		const 
		area = 3,
		area2 = 4,
		bool1 = pMapcoll[parseUnit(this.rect.y+area)][parseUnit(this.rect.x-area2)] || pMapcoll[parseUnit(this.rect.y+area)][parseUnit(this.rect.x+this.rect.w+area2)],
		bool2 = pMapcoll[parseUnit(this.rect.y+this.rect.h-area)][parseUnit(this.rect.x-area2)] || pMapcoll[parseUnit(this.rect.y+this.rect.h-area)][parseUnit(this.rect.x+this.rect.w+area2)]
		if(bool1 || bool2 == 1)
		{
			super.setHorizontalposition(-this.velocity.horizontal,true)
			this.state.touchingwall = 1
		}
		else
		{
			this.state.touchingwall = 0
		}
	}
	drift()
	{
		if(this.velocity.horizontal > 0)
		{
			this.velocity.horizontal = Math.max(this.velocity.horizontal - this.friction,0)
		}
		else
		{
			this.velocity.horizontal = Math.min(this.velocity.horizontal + this.friction,0)
		}
	}
	update(pMapcoll)
	{
		//if(pMapcoll == undefined)
		if(this.#boolflags.active)
		{
			super.setPosition(this.velocity.horizontal,this.velocity.vertical,true)			
			this.rect.x = this.rect.ox + this.position.ax
			this.rect.y = this.rect.oy + this.position.ay
			
			if(this.#boolflags.fall) this.fall(pMapcoll)
			
			if(this.#boolflags.clip) this.wallcollision(pMapcoll)
			
			if(this.#boolflags.drift) this.drift()
		}
	}
}
class basengine {
	#canvas
	#ctx
	#pics
	#scene_data
	constructor(setting)
	{
		this.#canvas = setting.canvas
		this.#canvas.width = setting.width
		this.#canvas.height = setting.height
		this.#ctx = this.#canvas.getContext('2d')
		this.#pics = []
		this.custom = {
			sort: false,
			timer: false
		}
		this.scripts = []
		this.#scene_data = null
	}
	setsceneData(e)
	{
		this.#scene_data = e
	}
	setscript(f)
	{
		if(typeof f == 'function') this.scripts.push(f)
	}
	delete_and_sort_script(i)
	{
		if(i < this.scripts.length && i > -1)
		{
			if(i == this.scripts.length-1)
			{
				this.scripts.pop()
			}
			else
			{
				for(j = i; j < this.script.length;j++)
				{
					this.scripts[j] = this.scripts[j+1]
				}
				this.scripts.pop()
			}
		}
		else
		{
			console.log('script #',i,'not found')
		}
	}
	delscript(i)
	{
		if(i <= this.scripts.length-1 && i > -1)
		{
			this.scripts[i] = this.scripts[this.scripts.length-1]
			this.scripts.pop()
		}
		else
		{
			console.log('script #' + i,'not found')
		}
	}
	load_pics(e)
	{
		if(typeof e.length != 'undefined') this.#pics = e
	}
	getpics()
	{
		return this.#pics
	}
	render()
	{
		if(!this.custom.sort) this.#pics = this.#pics.sort((a,b)=>{ return b.position.az - a.position.az})
		this.#pics.forEach((e)=>{
		if('update' in e) {e.update(this.#scene_data.scene.collisionlayer)}
		if(!e.customrender) {e.draw()}
		})
	}
	Display()
	{
	}
	run()
	{
		const frameloop=()=>{
			this.scripts.forEach((e)=>{e()})
			this.render()
			requestAnimationFrame(frameloop)
		}
		frameloop()
	}
}