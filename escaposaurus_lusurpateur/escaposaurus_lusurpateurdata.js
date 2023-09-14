<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_lusurpateur/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"udisk/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/

		var udiskData =
	  	{"root":{
	  		"folders":
		  		[
		  		{"foldername":"jazz",
				  	"files":[
						"jazz_effrayant.jpg",
						"jazz_endormi.jpg",
						"jazz_grossetete.jpg",
						"jazz_jardin.jpg",
						"jazz_mignon.jpg"
					]
				},
				{"foldername":"resultats","password":"thompson", "passwordHint":"Nom de famille du signataire de mon bienfaiteur", "sequence":2,
			  		"files":[
						"miss_usa.mp4", 
						"nba_contest.mp4",
						"resultats.jpg",
						"resultats_golf.jpg",
						"resultats_suffrages.jpg",    
					]
			  	},
				  {"foldername":"comptabilite","password":"finances", "passwordHint":"Dernier ordre du jour", "sequence":1,
				  "files":[
					"scan_cheque.jpg", 
				]
			  },
			  	{"foldername":"reunions","password":"jazz", "passwordHint":"Pas besoin d'une indication","sequence":0,
			  		"folders":[
						{"foldername":"comptes-rendus", 
						"files":[
							"21-10-1987.jpg",
							"03-02-1988.jpg",
							"11-02-1988.jpg",
							"annexe.jpg"
						],
						}
					],
					"files":[
						"reunion.mp4"
					]
			  	},
		 		],
				"files":[]
			}
		} ;

		var gameTitle = "L'Usurpateur" ;
		var gameDescriptionHome = "Vous êtes un étudiant dans une université américaine pour les sourds" ;
		var gameMissionCall = "Voici la disquette que votre amie syndicaliste Peter Floyd à volé à l'administration" ;
		var gameMissionAccept = "&raquo;&raquo; Accepter la mission et charger la disquette dans votre PC (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Florian Caron<br/>Morgane Raymond<br/>Aurore Berthet<br/>Victorien Prévot<br/>Sasha Burlet<br/>Jérémy Loïc Auclair" ;
		var gameThanks = "Remerciements : <br/> Théophile Carrasco <br/> Romain Belet <br/> Margot Thietot" ;

		var OSName = "Gate OS 2.11.2		copyright Picosoft 1988" ;
		var explorerName = "FLOPPY DISK EXPLORER" ;
		var callerAppName = "CONTACTS" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "CHAT EN COURS..." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Rien à demander, ne pas les déranger." ;
		var prompt = [] ;
		prompt[0] = "" ;
		prompt[1] = "" ;
		prompt[2] = "Envoyer le document" ;
		prompt[3] = "Envoyer le document" ;
		
		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 3 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "none" ;
		seqMainHint[1] = "none" ;
		seqMainHint[2] = "scan_cheque.jpg" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[3] = "resultats_suffrages.jpg" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Peter", "vod_folder" : "", "username" : "Peter", "canal" : "video", "avatar" : "peter.png"} ;

		var helperContacts=[];
		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "none" ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "missing", "vod_folder" : "", "username" : "Peter", "canal" : "video", "avatar" : "peter.png"} ;

		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez de quoi démarrer une grande grève" ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si la preuve d'un truquage dans l'election, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;