import { Component, OnInit } from '@angular/core';
import { SortablejsOptions } from 'angular-sortablejs';
import { ApiConnectService } from '../services/api-connect.service';
import { HeroesService } from '../services/heroes.service';

// Import JQuery
declare var $: any;

@Component({
    selector: 'app-heroes',
    templateUrl: './heroes.component.html',
    styleUrls: ['./heroes.component.scss'],
})
export class HeroesComponent implements OnInit {

    // Variables
    numberOfPools: any;
    selectedPool: number;
    selectedPoolArray: any;
    selectedHero: any;
    selectedHeroesList: any;
    allHeroes = [];

    // hero category objects
    strengthHeroes = [];
    agilityHeroes = [];
    intelligenceHeroes = [];
    heroSearch: String;

    // attribute urls
    strURL = '/assets/images/strength.png';
    agiURL = '/assets/images/agility.png';
    intURL = '/assets/images/intelligence.png';

    pool1 = [];
    pool2 = [];
    pool3 = [];
    pool4 = [];
    pool5 = [];

    optionsSource: SortablejsOptions = {
        group: {
            name: 'clone-group',
            pull: 'clone',
            put: false,
        },
        sort: false,
    };

    optionsTarget: SortablejsOptions = {
        group: 'clone-group',
        sort: false,
    };

    constructor(private api: ApiConnectService, private heroesService: HeroesService) { }

    ngOnInit() {
        this.numberOfPools = [1, 2, 3, 4, 5];
        this.selectedPool = 1;
        this.selectedPoolArray = this.pool1;
        this.getHeroes();
        this.heroesService.currentHeroes.subscribe((heroes) => {
            this.selectedHeroesList = heroes;
        });
    }

    getHeroes(): void {
        // database call to retrieve all dota heroes
        this.api.getAllHeroes().subscribe((data) => {
            this.allHeroes = data['heroes'];
            this.getHeroImages();
            this.sortHeroData();
        });
    }

    getHeroImages(): void {
        this.allHeroes.forEach((hero) => {
            hero.image = this.api.getImageURL(hero.url);
            hero.qImage = this.api.getImageURL(hero.url_q);
            hero.wImage = this.api.getImageURL(hero.url_w);
            hero.eImage = this.api.getImageURL(hero.url_e);
            hero.rImage = this.api.getImageURL(hero.url_r);
        });
    }

    sortHeroData(): void {
        this.allHeroes.forEach((hero) => {
            if (hero.primaryAttribute === 'str') {
                this.strengthHeroes.push(hero);
                hero.attributeImage = this.strURL;
            } else if (hero.primaryAttribute === 'agi') {
                this.agilityHeroes.push(hero);
                hero.attributeImage = this.agiURL;
            } else if (hero.primaryAttribute === 'int') {
                this.intelligenceHeroes.push(hero);
                hero.attributeImage = this.intURL;
            }
        });
    }

    moveSelectedHero(hero: any): void {
        this.selectedPoolArray.push(hero);
        document.getElementById(`poolLink${this.selectedPool - 1}`).click();
    }

    setSelectedPool(pool: number): void {
        this.selectedPool = pool;
        switch (pool) {
        case 1:
            this.selectedPoolArray = this.pool1;
            break;
        case 2:
            this.selectedPoolArray = this.pool2;
            break;
        case 3:
            this.selectedPoolArray = this.pool3;
            break;
        case 4:
            this.selectedPoolArray = this.pool4;
            break;
        case 5:
            this.selectedPoolArray = this.pool5;
            break;
        }
    }

    togglePools(): void {
        if (confirm('Are you sure you want to toggle pools? All changes will be lost.')) {
            if (this.numberOfPools.length > 1) {
                this.numberOfPools = [1];
                document.getElementById('poolTabs').style.height = '0';
                document.getElementById('poolTabs').style.visibility = 'hidden';

                this.pool2.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool3.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool4.forEach((hero) => {
                    this.pool1.push(hero);
                });
                this.pool5.forEach((hero) => {
                    this.pool1.push(hero);
                });

                const tempPool = this.pool1;
                this.resetPools();
                this.pool1 = tempPool;
            } else {
                this.numberOfPools = [1, 2, 3, 4, 5];
                document.getElementById('poolTabs').style.height = '42px';
                document.getElementById('poolTabs').style.visibility = 'visible';
                this.resetPools();
            }
        }
    }

    setSelectedHeroesList(): void {
        this.selectedHeroesList = [];
        if (this.numberOfPools.length === 1) {
            this.selectedHeroesList = this.pool1;
        } else {
            this.selectedHeroesList.push(this.pool1);
            this.selectedHeroesList.push(this.pool2);
            this.selectedHeroesList.push(this.pool3);
            this.selectedHeroesList.push(this.pool4);
            this.selectedHeroesList.push(this.pool5);
        }
        this.heroesService.setSelectedHeroes(this.selectedHeroesList);
    }

    triggerResetPools(): void {
        if (confirm('Are you sure you want to reset?')) {
            this.resetPools();
        }
    }

    // Yes I know, its a mess :P
    triggerPopover(target: HTMLElement, hero: any) {
        $(target).popover({
            animation: true,
            placement: 'right',
            html: true,
            content: `
                <h5 style="text-shadow:none;">
                    <img src="${hero.attributeImage}" height="25">
                    ${hero.niceName}
                </h5>
                <p class="text-center">
                    <b>${hero.roles}</b>
                </p>
                <div class="text-center">
                    <figure class="text-center d-inline-block">
                        <img src="${this.strURL}" height="25">
                        <figcaption class="figure-caption text-center">
                            <b>${hero.baseStrength}</b> + ${hero.baseStrengthGain}
                        </figure-caption>
                    </figure>&nbsp;&nbsp;&nbsp;
                    <figure class="text-center d-inline-block">
                        <img src="${this.agiURL}" height="25">
                        <figcaption class="figure-caption text-center">
                            <b>${hero.baseAgility}</b> + ${hero.baseAgilityGain}
                        </figure-caption>
                    </figure>&nbsp;&nbsp;&nbsp;
                    <figure class="text-center d-inline-block">
                        <img src="${this.intURL}" height="25">
                        <figcaption class="figure-caption text-center">
                            <b>${hero.baseIntelligence}</b> + ${hero.baseIntelligenceGain}
                        </figure-caption>
                    </figure>
                </div>
                <b>Armor:</b>&nbsp;${hero.armor}<br>
                <b>Attack Damage (Max):</b>&nbsp;${hero.attackDamageMax}<br>
                <b>Attack Damage (Min):</b>&nbsp;${hero.attackDamageMin}<br>
                <b>Movement Speed:</b>&nbsp;${hero.movespeed}<br><br>
                <img src="${hero.qImage}" alt="" height="50">&nbsp;
                <img src="${hero.wImage}" alt="" height="50">&nbsp;
                <img src="${hero.eImage}" alt="" height="50">&nbsp;
                <img src="${hero.rImage}" alt="" height="50">
            `,
        });
    }

    removeHero(hero: any, pool: any): void {
        const index = pool.indexOf(hero);
        if (index !== -1) {
            pool.splice(index, 1);
        }
        document.getElementById(`poolLink${this.selectedPool - 1}`).click();
    }

    addHero(hero: any, pool: number): void {
        // console.log('Drop: ' + pool);
        this.setSelectedPool(pool);
        this.selectedPoolArray.push(hero);
        document.getElementById(`poolLink${this.selectedPool - 1}`).click();
    }

    setSelectedHero(hero: any): void {
        this.selectedHero = hero;
    }

    highlightPool(pool: number): void {
        document.getElementById(`poolLink${pool - 1}`).style.borderColor = '#a3a3a3';
    }

    unhighlightPool(pool: number): void {
        document.getElementById(`poolLink${pool - 1}`).style.borderColor = 'transparent';
    }

    resetPools(): void {
        this.pool1 = [];
        this.pool2 = [];
        this.pool3 = [];
        this.pool4 = [];
        this.pool5 = [];
        this.selectedPool = 1;
        this.selectedPoolArray = this.pool1;
    }

}
