
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
	cursor: 0,
	hitcircle: 2,
	hitcircleoverlay: 0,
	approachcircle: 1,
	cursortrail: 1,
	follows: 1,
	hit0:1,
	hit100: 1,
	hit50: 1,
	hit300: 1,
	reversearrow: 1,
	sliderb: 1,
	sliderfollowcircle: 0,
	sliderscorepoint: 1,
	sliderstartcircle: 2,
	sliderstartcircleoverlay: 0,
	sliderendcircle: 2,
	sliderendcircleoverlay: 2,
	spinner: 1,
	font: 1,
}

/////////////////////////////////////////////

var log = console.log.bind(console)
var fs = require('fs').promises
var path = require('path')
//var jimp = require('jimp')

function Rand(max){
	return Math.floor(Math.random() * max)
}

async function getRandomFile(relativepath){
	var dir = await fs.readdir(relativepath)
	var randfileint=Rand(dir.length)
	statfile = await fs.lstat( relativepath+"\\"+dir[randfileint] )
	if(!statfile.isDirectory()){
		return dir[randfileint]
	}else{
		return ""
	}

	
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

async function RandElement(config_var,element_filename,element_folder){
	var filename = ""
	switch (config_var){
		case 0:
			break
		case 1:
			while (filename === ""){
				filename = await getRandomFile("skins" + "\\" + element_folder)
			}
			filename = "skins" + "\\" + element_folder + "\\" + filename
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
		fs.copyFile(filename, skinFolder + "\\" + SkinRandomizerName + "\\" + element_filename + path.extname(filename))
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
	await fs.appendFile(skinini, '[Colours]'+'\n')
	await fs.appendFile(skinini, 'Combo1: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'Combo2: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'Combo3: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'Combo4: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'SliderBorder: '+RandColor()+'\n')
	await fs.appendFile(skinini, 'SliderTrackOverride:  '+RandColor()+'\n')
	await fs.appendFile(skinini, 'MenuGlow:  '+RandColor()+'\n')
	await fs.appendFile(skinini, 'StarBreakAdditive:  '+RandColor()+'\n')
	await fs.appendFile(skinini, 'InputOverlayText:  '+RandColor()+'\n')
	await fs.appendFile(skinini, 'SongSelectActiveText:  '+RandColor()+'\n')
	await fs.appendFile(skinini, 'SongSelectInactiveText:  '+RandColor()+'\n')
}

var SkinRandomizer = {

	run: async function(){	//анимирроованый оверлей
		//колоринг изоражений, комбо колоринг
		//сеты файлов
		//сеты юи
		//спинеры
		//динамические фолоупоинты
		//настраиваемая яркость фолоу поинтов, скорость
		//skin ini
		//await getAllFolowPoints()

		await RandElement(config.approachcircle, "approachcircle", "approachcircle")
		await RandElement(config.cursor, "cursor", "cursor")
		await RandElement(config.hit0, "hit0", "hit0")
		await RandElement(config.hitcircle, "hitcircle", "hitcircle")
		await RandElement(config.hitcircleoverlay, "hitcircleoverlay", "hitcircleoverlay")
		await RandElement(config.sliderb, "sliderb", "sliderb")
		await RandElement(config.sliderfollowcircle, "sliderfollowcircle", "sliderfollowcircle")
		await RandElement(config.sliderscorepoint, "sliderscorepoint", "sliderscorepoint")
		await RandElement(config.sliderstartcircle, "sliderstartcircle", "hitcircle")
		await RandElement(config.sliderstartcircleoverlay, "sliderstartcircleoverlay", "hitcircleoverlay")
		await RandElement(config.sliderendcircle, "sliderendcircle", "hitcircle")
		await RandElement(config.sliderendcircleoverlay, "sliderendcircleoverlay", "hitcircle")
		//await RandElement(config.hit50, "hit50", "hit50")
		//await RandElement(config.hit100, "hit100", "hit100")
		//await RandElement(config.reversearrow, "reversearrow", "reversearrow")

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