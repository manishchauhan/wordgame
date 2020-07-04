

//class game Logics
class viewModel
{

    constructor()
    {
        //current question
        this.currentQuestion=-1;
        this.mixed
        this.maxQuestion=5;
        this.totalDragBlocks=7;
        this.levelFilled=3;
        this.questionData=[
            {value:"COW"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"},
            {value:"APPLE"},
            {value:"MANGO"},
            {value:"SEVEN"},
            {value:"SUGAR"}
        ]
     //   this.currentLevelData();
    }
    //get current question
    getcurrentQuestion()
    {
        return this.currentQuestion;
    }
    //get total number of question
    getMaxQuestion()
    {
        return this.maxQuestion;
    }
    //update question
    setcurrentQuestion(_incremnet)
    {
        this.currentQuestion+=_incremnet;
    }
    //get total blocks
    gettotalDragBlocks()
    {
        return this.totalDragBlocks;
    }
    //get random color
    getRandomColor()
    {
        return '0x'+(Math.random()*0xFFFFFF<<0).toString(16);
    }
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    currentLevelData()
    {
         let mixedChars=["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", 
         "W", "X", "Y", "Z"];
         this.setcurrentQuestion(1);      
         const tempArray=this.questionData[this.currentQuestion].value.split("");
         console.log(tempArray)
         let newMixedChar=mixedChars.filter((value,index)=>{
             return tempArray.indexOf(value)<0;
        });
        this.shuffleArray(newMixedChar);
        let newCharArray=[];
        const maxBound=Math.abs(this.totalDragBlocks-this.levelFilled);
        for(let i=0;i<maxBound;i++)
        {
            newCharArray.push(newMixedChar[i]);
        }
        for(let i=0;i<this.levelFilled;i++)
        {
            newCharArray.push(tempArray[i]);
        }
      
        return  this.shuffleArray(newCharArray);

    }
    checkAnswer(answer)
    {
        let status=false;
        this.questionData.find((data)=>{
            
            if(data.value===answer)
            {
                status=true;
            }
        })
       
        return status;
    }
}




//drag object ----------------------
class dragObject extends Phaser.GameObjects.Container {
    constructor(scene, x, y, children) {
        super(scene, x, y, children);
    
        // ...
        this.label=undefined;
        this.word=undefined;
        this.parentContainer=undefined;
        scene.add.existing(this);
    }
     
    dragAllowed(parent,dragSize={width:100,height:100})
    {
      //  this.parentContainer=parent;
        this.previousPosition={x:this.x,y:this.y};
        this.dragMode=false;
        this.setSize(dragSize.width, dragSize.height);
        this.setInteractive();
         this.scene.input.setDraggable(this);
         //drag start
         
         this.scene.input.on('dragstart',  (pointer, gameObject)=> {
           
            this.scene.tweens.add({
                targets: gameObject,
                scaleX: { value: 1.25, duration: 150,  ease: 'Quad.easeInOut' },
                scaleY: { value: 1.25, duration: 150,  ease: 'Quad.easeInOut' },
                
            });
           
            
            
    
        });
        this.scene.input.on('pointerup', function(pointer,gameObject){
            this.scene.tweens.add({
                targets: gameObject,
                scaleX: { value: 1, duration: 150,  ease: 'Quad.easeInOut' },
                scaleY: { value: 1, duration: 150,  ease: 'Quad.easeInOut' }
                
            });
            // ...
            
         });

       
        //drag
       this.scene.input.on('drag',(pointer, gameObject, dragX, dragY)=>{
              gameObject.x = dragX;
              gameObject.y = dragY;
              this.dragMode=true;
              this.scene.children.bringToTop(gameObject);
              
       })
       //drag stop
       this.scene.input.on('dragend',(pointer, gameObject,dropped, dragX, dragY)=>{
           if( gameObject.input.enabled ===true)
           {
            if(!dropped)
            {
                this.scene.tweens.add({
                    targets: gameObject,
                    scaleX: { value: 1, duration: 150,  ease: 'Quad.easeInOut' },
                    scaleY: { value: 1, duration: 150,  ease: 'Quad.easeInOut' }
                    
                });
                this.scene.tweens.add({
                    targets: gameObject,
                    x: { value: gameObject.previousPosition.x, duration: 500,  ease: 'Quad.easeInOut' },
                    y: { value: gameObject.previousPosition.y, duration: 500,  ease: 'Quad.easeInOut' }
                    
                });
                this.scene.swapGameObjects(gameObject);
            }else if(dropped)
            {
                gameObject.input.enabled=false;
                this.scene.onDrop(gameObject,dropped)
            }
        
           }
           
           
        })
    }
   
    resetText(word)
    {
        this.label.text=word;
        this.word=word;
    }
    
}

//view
class wordGame extends Phaser.Scene
{
    constructor()
    {
        super({key:"wordGame"});
        this.userAnswer="";
    }
    //preload assets
    preload()
    {
        //game model handles all game logics
        this.gameModel=new viewModel();
        this.load.image("button","assets/button.png");
        this.load.image("box","assets/box.png");
    }
    //create view
    addDropElements()
    {
        //add a drop zone
            //  A drop zone
      
        
        
        
        for(let i=0;i!=this.gameModel.levelFilled;i++)
        {
            let dropArea=this.add.image(0, 0, 'box');
          //  dropArea.tint=0x000000;
            dropArea.setScale(0.25);
            dropArea.x=window.innerWidth/2-Math.round(i*dropArea.width/3.75);
            dropArea.y=100;
            dropArea.tint=0x000000;
            dropArea.filled=false;
            this.add.image(dropArea);
            this.dropSpriteArray.push(dropArea);
            
        }
        
        
    }
    addDragElements()
    {

        let levelData=this.gameModel.currentLevelData();
        for(let i=0;i!=this.gameModel.gettotalDragBlocks();i++)
        {
            //add image
            let dragImg=this.add.image(0, 0, 'box');
            dragImg.setScale(0.25);
            dragImg.tint=this.gameModel.getRandomColor();
            //add text
            let txt = this.add.text(0, 0, levelData[i],{
                fontSize: '25px',
                fontFamily: 'Arial',
                color: '#ffffff',
                align: 'center',

            });
            const textValue=levelData[i];
            txt.x=-txt.width/2;
            txt.y=-txt.height/2;
            let dragSprite= new dragObject(this,0,0,[dragImg,txt]);
            dragSprite.label=txt;
            dragSprite.word=textValue;
            dragSprite.x=window.innerWidth/1.25-Math.round(i*dragImg.width/2.5);
            dragSprite.y=window.innerHeight-175;
            dragSprite.dragAllowed(this,{width:Math.round(dragImg.width/4),height:Math.round(dragImg.height/4)});     
            this.dragSpriteArray.push(dragSprite);
           
        }
        
    }
    disableDragOptions(status)
    {
        this.dragSpriteArray.forEach((option)=>{
            option.input.enabled=status;
        })
    }
    clearAndResetAll()
    {
        this.userAnswer="";
        this.gameModel.setcurrentQuestion(-1);
        this.dragSpriteArray.forEach((node)=>{
            this.tweens.add({
                targets: node,
                x: { value: node.previousPosition.x, duration: 500,  ease: 'Quad.easeInOut' },
                y: { value: node.previousPosition.y, duration: 500,  ease: 'Quad.easeInOut' }
                
            });
           
        })
        this.dropSpriteArray=[];
        this.addDropElements();   
        this.disableDragOptions(true);
    }
    moveToNextLevel()
    {
        this.userAnswer="";
        this.dragSpriteArray.forEach((node)=>{
            this.tweens.add({
                targets: node,
                x: { value: node.previousPosition.x, duration: 500,  ease: 'Quad.easeInOut' },
                y: { value: node.previousPosition.y, duration: 500,  ease: 'Quad.easeInOut' }
                
            });
           
        })
        this.hitZone.destroy();
        this.gameModel.levelFilled=5;
        let levelData=this.gameModel.currentLevelData();
        this.dropSpriteArray=[];
        this.addDropElements();   
        this.addHitZone();
        this.disableDragOptions(true);
        
        this.dragSpriteArray.map((node,index)=>{
            node.resetText(levelData[index]);
        })
    }
    levelClearInst(levelInst,status)
    {
    
        let style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };
        let text = this.add.text(0, 0, levelInst, style);
        text.x=window.innerWidth/2-text.width/2;
        text.y=400;
        if(!status)
        {
            
            setTimeout(()=>{
                text.destroy();
                this.clearAndResetAll();
            },3000)
          
        }else
        {
            setTimeout(()=>{
                text.destroy();
                this.moveToNextLevel();
            },3000)
        }
    
       
    }
    fillDropArea(gameObject)
    {
        //fill first element in list
        let swapBox=this.dropSpriteArray.pop();
        gameObject.x=swapBox.x;
        gameObject.y=swapBox.y;
        this.userAnswer+=gameObject.word;
        swapBox.destroy();
        if(this.dropSpriteArray.length==0)
        {
            this.disableDragOptions(false);
            if(this.gameModel.checkAnswer(this.userAnswer))
            {
                this.levelClearInst("Level cleared wait for 3 second to move next level",true);
            }
            else
            {
                this.levelClearInst(" try again game would be \n reset in 3 seconds",false);
            }
            
        }
        
        
    }

    onDrop(gameObject,dropped)
    {
        this.fillDropArea(gameObject);
        
    }
     checkOverlap(gameObjectA,gameObjectB) {
        var boundsA = gameObjectA.getBounds();
        var boundsB=gameObjectB.getBounds();
        return Phaser.Geom.Intersects.RectangleToRectangle(boundsA, boundsB);
    }
    swapGameObjects(gameObject)
    {
        for(let i=0;i!=this.dragSpriteArray.length;i++)
        {
            if(this.dragSpriteArray[i]!=gameObject)
            {
               if(this.checkOverlap(gameObject,this.dragSpriteArray[i]))
               {
                
                 const temp1={x:this.dragSpriteArray[i].previousPosition.x,y:this.dragSpriteArray[i].previousPosition.y};
                  this.dragSpriteArray[i].previousPosition.x=gameObject.previousPosition.x;
                  this.dragSpriteArray[i].previousPosition.y=gameObject.previousPosition.y;
                  this.tweens.add({
                    targets: this.dragSpriteArray[i],
                    x: { value: gameObject.previousPosition.x, duration: 500,  ease: 'Quad.easeInOut' },
                    y: { value: gameObject.previousPosition.y, duration: 500,  ease: 'Quad.easeInOut' },onComplete:  ()=> {
                        
                    }
                    
                });
                  gameObject.previousPosition.x=temp1.x;
                  gameObject.previousPosition.y=temp1.y;
                   this.tweens.add({
                    targets: gameObject,
                    x: { value: temp1.x, duration: 500,  ease: 'Quad.easeInOut' },
                    y: { value: temp1.y, duration: 500,  ease: 'Quad.easeInOut' },onComplete:  ()=> {
                        
                    }
                    
                });
               }
               
            }
            
        }
      
    }
    addHitZone()
    {
        if(this.graphics)
        {
            this.graphics.destroy();
        }
        let width=0;
        this.dropSpriteArray.forEach((node)=>{
            width+=node.width;
        })
        
        this.hitZone= this.add.zone(this.dropSpriteArray[0].x-width/10, this.dropSpriteArray[0].y, 400, 100).setRectangleDropZone(400, 100);
        this.graphics = this.add.graphics();
        this.graphics.lineStyle(2, 0xffff00);
        this.graphics.strokeRect(this.hitZone.x - this.hitZone.input.hitArea.width / 2, this.hitZone.y - this.hitZone.input.hitArea.height / 2, 
            this.hitZone.input.hitArea.width, this.hitZone.input.hitArea.height);
            this.graphics.alpha=0.25;  
    }
    create()
    {
     
        this.dragSpriteArray=[];  
        this.dropSpriteArray=[];
        this.addDropElements();   
        this.addHitZone();
        this.addDragElements();
    }


}