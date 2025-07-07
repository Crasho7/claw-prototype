export class Start extends Phaser.Scene {
    constructor() {
        super('Start');

        this.clawMoving = false;
        this.isDragging = false;
        this.capsule = null;
        this.capsuleCaught = false;
    }

    preload() {
        
        this.load.image('clawbase','assets/claw.png');
        this.load.image('claw-clamp','assets/claw-clamp.png');
        this.load.image('capsule','assets/capsule.png');
        this.load.image('handler','assets/handler.png');
        this.load.spritesheet('button', 'assets/button.png', {frameWidth: 103, frameHeight:82});
    }

    create() {
        //Claw
        this.clawLeft = this.add.sprite(-4,180,'claw-clamp').setOrigin(1,0).setAngle(25);
        this.clawRight = this.add.sprite(4,180,'claw-clamp').setFlipX(true).setOrigin(0,0).setAngle(-25);
        const clawBase = this.add.sprite(0,0,'clawbase');
        
        this.claw = this.add.container(215, -100, [clawBase, this.clawLeft, this.clawRight]);

        //capsules
        this.capsules = this.physics.add.group(); 
        this.capsules.add(this.physics.add.sprite(200,350, 'capsule'));
        this.capsules.add(this.physics.add.sprite(150,490, 'capsule'));
        this.capsules.add(this.physics.add.sprite(350,490, 'capsule'));
        this.capsules.add(this.physics.add.sprite(240,450, 'capsule'));


        //Other objects
        this.handler = this.add.sprite(300,750,'handler').setOrigin(0.5,1);
        this.buttonClaw = this.add.sprite(120,720,'button', 0).setInteractive();        

        this.buttonClaw.on('pointerdown', () =>{
            if(!this.clawMoving){
                this.buttonClaw.setFrame(1);
                this.dropClaw();
            }
        });
        
        this.handler.setInteractive({draggable: true});
        this.handlerDrag(this.handler); 
       
    }


   handlerDrag (item){

        item.on('dragstart', (pointer, gameObject) => {
            this.isDragging = true;
        });
  
       item.on('drag', (pointer, dragX, dragY) => {
            if(dragX <= item.x){
                item.angle = -10;
                this.clawMovementX('left');
            }else if(dragX >= item.x){
                item.angle = 10;
                this.clawMovementX('right');
            }
        });

        item.on('dragend', (pointer, gameObject) => {
            this.isDragging = false;
        });
    }


    clawMovementX(movement){
        if(this.isDragging){
            if(movement === 'right' && this.claw.x <= 330){
                this.claw.x += 8;
            } else if (movement === 'left' && this.claw.x  >=  100){
                this.claw.x -= 8;
            }
        }
    }

    dropClaw(){
        this.clawMoving = true;

        this.dropTween = this.tweens.add({
            targets: this.claw,
            y: 260,
            duration: 600,
            ease: 'Linear',
            onUpdate: () => {
                if(!this.dropTween) return;
                
                const clawBounds = this.claw.getBounds();

                console.log('update');
                this.capsules.getChildren().forEach(capsule => {
                    if(Phaser.Geom.Intersects.RectangleToRectangle(clawBounds, capsule.getBounds())){
                        this.dropTween.stop();

                        this.capsule = capsule;
                        this.alignCapsuleToClaw();

                        this.closeClaw(() => this.raiseClaw());
                    }
                } )
            },
            onComplete: () => {
                this.closeClaw(() => this.raiseClaw());
            }
        });
    }
    
    raiseClaw(){
        this.tweens.add({
            targets: this.claw,
            y: -100,
            duration: 600,
            ease: 'Linear',
            onComplete:() => {
                this.openClaw();
                this.buttonClaw.setFrame(0);
                this.capsuleCaught = false;
                this.clawMoving = false;
            }
        })
    }

    update() {
        if (this.capsuleCaught) {
            this.capsule.x = this.claw.x;
            this.capsule.y = this.claw.y + 260;
        }
    }

    closeClaw(callback){
        this.tweens.add({
            targets: this.clawLeft,
            angle: -10,
            duration: 400,
            ease: 'Power2'
        })
        this.tweens.add({
            targets: this.clawRight,
            angle: 10,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                callback();
            }
        })
    }
    
    openClaw(){
        this.tweens.add({
            targets: this.clawLeft,
            angle: 10,
            duration: 400,
            ease: 'Power2'
        })
        this.tweens.add({
            targets: this.clawRight,
            angle: -10,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                if(this.capsule){
                    this.capsule.destroy();
                }
            }
        })
    }

    alignCapsuleToClaw(){
        console.log("hello")
        this.tweens.add({
            targets: this.capsule,
            x: this.claw.x,
            y: this.claw.y + 260,
            duration: 300,
            ease: 'Sine.easeOut',
            onComplete: () => {
                this.capsuleCaught = true;
                this.closeClaw(() => this.raiseClaw());
            }
        });
    }

}
