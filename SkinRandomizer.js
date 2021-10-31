
////////////////////////////////////////////
///////////////CONFIG///////////////////////
////////////////////////////////////////////

const skinFolder = "C:\\Osu\\Skins"
const SkinRandomizerName = "SkinRandomizer"

///////////////////////////////////////////
// 0 - не изменять
// 1 - менять на рандомный
// 2 - вставить пустой файл
// 3 - дефолтный (удалить)
// Текст в кавычках - выбор вручную (из папки) например "cursor.png"
var config = {
	cursor: 1,
	cursormiddle: 1,
	cursortrail: 1,
	cursorripple: 1,
	cursorsmoke: 1,
	hitcircle: 1,
	hitcircleoverlay: 1,
	approachcircle: 1,
	hit0:1,
	hit100: 1,
	hit50: 1,
	hit300: 1,
	reversearrow: 1,
	sliderb: 1,
	sliderfollowcircle: 1,
	sliderscorepoint: 1,
	sliderstartcircle: 2,
	sliderstartcircleoverlay: 1,
	sliderendcircle: 2,
	sliderendcircleoverlay: 2,
	spinnerapproachcircle: 1,
	spinnerbottom: 1,
	spinnercircle: 1,
	spinnerclear: 1,
	spinnerglow: 1,
	spinnermiddle: 1,
	spinnermiddle2: 1,
	spinnerrpm: 1,
	spinnerspin: 1,
	spinnertop: 1,

	followpoint: 1,
	folowpointsStartFrame: 1,
	folowpointsLength: 5,
	//spinner background spinner metre
	//font: 1,
}

/////////////////////////////////////////////

var log = console.log.bind(console)
var fs = require('fs').promises
var path = require('path')
var jimp = require('jimp')

function Rand(max){
	return Math.floor(Math.random() * max)
}

async function getRandomFile(relativepath){
	var dir = await fs.readdir(relativepath)
	var randfileint=Rand(dir.length)
	statfile = await fs.lstat( relativepath+"\\"+dir[randfileint] )
	return dir[randfileint]
}

async function DeleteElement(element){
	try {
		await fs.access(skinFolder + "\\" + SkinRandomizerName + "\\" + element + ".png", fs.F_OK)
	} catch (e){
		try {
			await fs.access(skinFolder + "\\" + SkinRandomizerName + "\\" + element + ".jpg", fs.F_OK)
		} catch (e){
			return
		}
		await fs.unlink(skinFolder + "\\" + SkinRandomizerName + "\\" + element + ".jpg")
	}
	await fs.unlink(skinFolder + "\\" + SkinRandomizerName + "\\" + element + ".png")
}

async function CopyElement(configVar, elementFrom,elementTo){
	if (configVar != 0 && configVar != 3){
		try {
			await fs.access(skinFolder + "\\" + SkinRandomizerName + "\\" + elementFrom+".png", fs.F_OK)
			await fs.copyFile(skinFolder + "\\" + SkinRandomizerName + "\\" + elementFrom+".png", skinFolder + "\\" + SkinRandomizerName + "\\" + elementTo+".png" )
		} catch (e){
			//do nothing
		}
	}
}

async function RandElement(config_var,element_filename,element_folder){
	var filename = ""
	switch (config_var){
		case 0:
			break
		case 1:
			filename = await getRandomFile("skins" + "\\" + element_folder)
			var statfile = await fs.lstat( "skins" + "\\" + element_folder + "\\" + filename )
			if(statfile.isDirectory()){
				await CopyFolder( "skins" + "\\" + element_folder + "\\" + filename, element_filename)
			} else {
				filename = "skins" + "\\" + element_folder + "\\" + filename
			}
			break
		case 2:
			filename = "skins" + "\\" + "empty.png"
			break
		case 3:
			await DeleteElement (element_filename)
			break
		default:
			filename = config_var
			filename = "skins" + "\\" + element_folder + "\\" + filename
			break
	}
	if (config_var != 0 && config_var != 3){
		if (  (config_var == 1 && !statfile.isDirectory()) || config_var != 1  ){
			await fs.copyFile(filename, skinFolder + "\\" + SkinRandomizerName + "\\" + element_filename + path.extname(filename))
		}
	}

}

async function CopyFolder(elements_folder, element_filename){
	switch (element_filename){
		case "spinner-baсkground":
		case "spinner-metre":
			try {
				await fs.access(elements_folder + "\\spinner-baсkground.png", fs.F_OK)
				await fs.copyFile(elements_folder + "\\spinner-baсkground.png", skinFolder + "\\" + SkinRandomizerName + "\\spinner-baсkground.png")
			} catch (e){
				await fs.copyFile("skins" + "\\" + "empty.png", skinFolder + "\\" + SkinRandomizerName + "\\spinner-baсkground.png")
			}
			try {
				await fs.access(elements_folder + "\\spinner-metre.png", fs.F_OK)
				await fs.copyFile(elements_folder + "\\spinner-metre.png", skinFolder + "\\" + SkinRandomizerName + "\\spinner-metre.png")
			} catch (e){
				await fs.copyFile("skins" + "\\" + "empty.png", skinFolder + "\\" + SkinRandomizerName + "\\spinner-metre.png")
			}
			break
		default:
			log("another "+element_filename+" "+elements_folder)
			break
	}
}

async function getAllFolowPoints(){
	var searchdir = "D:\\skins\\Skins"
	var skinslist = await fs.readdir(searchdir)
	var foldernumber = 0
	for (var skinfolder of skinslist){
		foldernumber++
		var skinsfileslist = await fs.readdir(searchdir+"\\"+skinfolder)
		for (var skinfile of skinsfileslist){
			var newdir = "skins\\followpoint\\"+foldernumber
			if (skinfile.startsWith("followpoint-")){
				try {
					await fs.access( newdir , fs.F_OK)
				} catch (e){
					await fs.mkdir(newdir)
				}
				await fs.copyFile(searchdir+"\\"+skinfolder+"\\"+skinfile ,  "skins\\followpoint\\"+foldernumber+"\\"+skinfile)
			}
		}
		
	}
}

async function renameFolders(path){
	var skinslist = await fs.readdir("skins\\"+path)
	var int=1
	for (var skinfolder of skinslist){
		statfile = await fs.lstat( "skins\\"+path+"\\"+skinfolder )
		if(statfile.isDirectory()){
			await fs.rename("skins\\spinner-baсk-and-metre\\"+skinfolder,"skins\\spinner-baсk-and-metre\\"+int)
			int++
		}
	}
}

async function removeEmptyFolders(){
	var skinslist = await fs.readdir("skins\\"+'spinner-baсk-and-metre')
	for (var skinfolder of skinslist){
		statfile = await fs.lstat( "skins\\"+'spinner-baсk-and-metre'+"\\"+skinfolder )
		if(statfile.isDirectory()){
			var skinFolderCheck = await fs.readdir("skins\\"+'spinner-baсk-and-metre'+"\\"+skinfolder)
			var found = 0
			for (var skinfile of skinFolderCheck){
				if (skinfile === "spinner-background.png" || skinfile === "spinner-metre.png"){
					found = 1
				}
			}
			if (found == 0){
				await fs.rmdir("skins\\"+'spinner-baсk-and-metre'+"\\"+skinfolder, { recursive: true, force: true })
				log ('delete '+"skins\\"+'spinner-baсk-and-metre'+"\\"+skinfolder)
			}
		}
	}
}

function RandColor(){
	return Rand(255)+","+Rand(255)+","+Rand(255)
}

async function MakeSkinIni(){
	var skinini = skinFolder + "\\" + SkinRandomizerName + "\\" + 'skin.ini'
	await fs.writeFile(skinini, '')
	await fs.appendFile(skinini, '[General]'+'\n')
	await fs.appendFile(skinini, 'Name: '+SkinRandomizerName+'\n')
	await fs.appendFile(skinini, 'Author: SadGod'+'\n')
	await fs.appendFile(skinini, 'Version: latest'+'\n')
	await fs.appendFile(skinini, 'CursorRotate: 0'+'\n')
	await fs.appendFile(skinini, 'CursorExpand: 0'+'\n')
	await fs.appendFile(skinini, 'CursorCentre: 1'+'\n')
	await fs.appendFile(skinini, 'SliderBallFrames: 1'+'\n')
	await fs.appendFile(skinini, 'AllowSliderBallTint: 1'+'\n')
	await fs.appendFile(skinini, 'SliderBallFlip: 1'+'\n')
	await fs.appendFile(skinini, '\n[Colours]\n')
	var rand_colors_num = 1+Rand(7)
	log("Colors "+rand_colors_num)
	for(var rand_color_i = 1; rand_color_i <= rand_colors_num; rand_color_i++){
		await fs.appendFile(skinini, 'Combo'+rand_color_i+': '+RandColor()+'\n')
	}
	await fs.appendFile(skinini, 'SliderBorder: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'SliderTrackOverride:  0,0,0'+'\n')
	await fs.appendFile(skinini, 'MenuGlow:  255,90,179'+'\n')
	await fs.appendFile(skinini, 'StarBreakAdditive: 0,204,255'+'\n')
	await fs.appendFile(skinini, 'InputOverlayText:  255,255,255'+'\n')
	await fs.appendFile(skinini, 'SongSelectActiveText:  255,255,255'+'\n')
	await fs.appendFile(skinini, 'SongSelectInactiveText:  175,175,175'+'\n')
}

async function SetFolowPoints(){
	if (config.followpoint == 3 || config.followpoint == 1){
		var skinfiles = await fs.readdir(skinFolder + "\\" + SkinRandomizerName)
		for (var skinfile of skinfiles){
			if (skinfile.toLowerCase().indexOf("followpoint") != -1){
				await fs.unlink(skinFolder + "\\" + SkinRandomizerName + "\\" + skinfile)
			}
		}
	}
	if (config.followpoint != 0 && config.followpoint != 3){
		await RandElement(config.followpoint, "followpoint", "followpoint")
		await RandomHueImage("followpoint")
		if (config.followpoint == 1){
			for (var i = 0; i<=config.folowpointsLength+config.folowpointsStartFrame; i++){
				
				var followpointpath = skinFolder + "\\" + SkinRandomizerName + "\\" + "followpoint-"+i+".png"

				if ( i < config.folowpointsStartFrame ){
					await fs.copyFile("skins" + "\\" + "empty.png", followpointpath )
				}
				if ( i >= config.folowpointsStartFrame && i < config.folowpointsLength+config.folowpointsStartFrame){
					await fs.copyFile(skinFolder + "\\" + SkinRandomizerName + "\\" + "followpoint.png", followpointpath )
				}
				if ( i > config.folowpointsLength+config.folowpointsStartFrame-1 ){
					await fs.copyFile("skins" + "\\" + "empty.png", followpointpath )

					break
				}
			}
		}
		await fs.unlink(skinFolder + "\\" + SkinRandomizerName + "\\" + "followpoint.png")
		if (config.followpoint == 2){
			await fs.rename(skinFolder + "\\" + SkinRandomizerName + "\\" + "followpoint.png", skinFolder + "\\" + SkinRandomizerName + "\\" + "followpoint-0.png")
		}
	}
	if (config.followpoint == 3){
		var skinfiles = await fs.readdir(skinFolder + "\\" + SkinRandomizerName)
		for (var skinfile of skinfiles){
			if (skinfile.toLowerCase().indexOf("followpoint") != -1){
				await fs.unlink(skinFolder + "\\" + SkinRandomizerName + "\\" + skinfile)
			}
		}
	}
}

async function RandomHueImage(name){
	var randomhue = Rand(360)-180
	await jimp.read(skinFolder + "\\" + SkinRandomizerName + "\\" + name+".png")
	.then(img=>{
		img.color([
			{ apply: 'hue', params: [randomhue] }])
		img.write(skinFolder + "\\" + SkinRandomizerName + "\\" + name+".png")
	})

}

var SkinRandomizer = {

	run: async function(){	

		//анимирроованый оверлей
		//колоринг изоражений, комбо колоринг
		//сеты файлов
		//сеты юи
		//спинеры
		//динамические фолоупоинты
		//настраиваемая яркость фолоу поинтов, скорость
		//skin ini
		//await getAllFolowPoints()
		
		await RandElement(config.approachcircle, "approachcircle", "approachcircle")
		await RandomHueImage("approachcircle")
		await RandElement(config.cursor, "cursor", "cursor")
		await RandomHueImage("cursor")
		await RandElement(config.cursormiddle, "cursormiddle", "cursormiddle")
		await RandomHueImage("cursormiddle")
		await RandElement(config.cursortrail, "cursortrail" ,"cursortrail")
		await RandomHueImage("cursortrail")
		await RandElement(config.cursorripple,"cursor-ripple", "cursor-ripple")
		await RandomHueImage("cursor-ripple")
		await RandElement(config.cursorsmoke,"cursor-smoke", "cursor-smoke")
		await RandomHueImage("cursor-smoke")

		await RandElement(config.hitcircle, "hitcircle", "hitcircle")
		await RandomHueImage("hitcircle")
		await RandElement(config.hitcircleoverlay, "hitcircleoverlay", "hitcircleoverlay")
		await RandomHueImage("hitcircleoverlay")

		await RandElement(config.sliderstartcircle, "sliderstartcircle", "hitcircle")
		await RandomHueImage("sliderstartcircle")

		await RandElement(config.sliderstartcircleoverlay, "sliderstartcircleoverlay", "hitcircleoverlay")
		await RandomHueImage("sliderstartcircleoverlay")

		await RandElement(config.sliderendcircle, "sliderendcircle", "hitcircle")
		await RandomHueImage("sliderendcircle")

		await RandElement(config.sliderendcircleoverlay, "sliderendcircleoverlay", "hitcircleoverlay")
		await RandomHueImage("sliderendcircleoverlay")
		
		await RandElement(config.sliderb, "sliderb", "sliderb")
		await RandomHueImage("sliderb")
		await RandElement(config.sliderfollowcircle, "sliderfollowcircle", "sliderfollowcircle")
		await RandomHueImage("sliderfollowcircle")
		await RandElement(config.sliderscorepoint, "sliderscorepoint", "sliderscorepoint")
		await RandomHueImage("sliderscorepoint")
		await RandElement(config.reversearrow, "reversearrow", "reversearrow")
		await RandomHueImage("reversearrow")

		await RandElement(config.hit0, "hit0-0", "hit0")
		await RandElement(config.hit50, "hit50-0", "hit50")
		await RandElement(config.hit100, "hit100-0", "hit100")
		await RandElement(config.hit300, "hit300-0", "hit300")

		await CopyElement(config.hit100, "hit100-0","hit100k-0")
		await CopyElement(config.hit300, "hit300-0","hit300k-0")
		await CopyElement(config.hit300, "hit300-0","hit300g-0")

		await RandElement(config.spinnerapproachcircle, "spinner-approachcircle" , "spinner-approachcircle")
		await RandomHueImage("spinner-approachcircle")
		await RandElement(config.spinnerbottom, "spinner-bottom", "spinner-bottom")
		await RandomHueImage("spinner-bottom")
		await RandElement(config.spinnercircle, "spinner-circle", "spinner-circle")
		await RandomHueImage("spinner-circle")
		await RandElement(config.spinnerclear, "spinner-clear", "spinner-clear")
		await RandElement(config.spinnerglow, "spinner-glow", "spinner-glow")
		await RandElement(config.spinnermiddle, "spinner-middle", "spinner-middle")
		await RandomHueImage("spinner-middle")
		await RandElement(config.spinnermiddle2, "spinner-middle2", "spinner-middle2")
		await RandomHueImage("spinner-middle2")
		await RandElement(config.spinnerrpm, "spinner-rpm", "spinner-rpm")
		await RandomHueImage("spinner-rpm")
		await RandElement(config.spinnerspin, "spinner-spin", "spinner-spin")
		await RandomHueImage("spinner-spin")
		await RandElement(config.spinnertop, "spinner-top", "spinner-top")
		await RandomHueImage("spinner-top")

		await SetFolowPoints()

		//hitcircleselect

		await MakeSkinIni()

		log('skin randomized. go play')
	}
}

main = async function(){
	try {
		await fs.access(skinFolder + "\\" + SkinRandomizerName, fs.F_OK)
	} catch (e){
		if (e.code === 'ENOENT') {
			await fs.mkdir(skinFolder + "\\" + SkinRandomizerName);
		}
	}
	
	return (await SkinRandomizer.run())
}
main()