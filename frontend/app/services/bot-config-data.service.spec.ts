import { TestBed, inject } from '@angular/core/testing';

import { BotConfigDataService } from './bot-config-data.service';
import { Router } from '@angular/router';
import { RoutesModule } from '../routes/routes.module';

describe('BotConfigDataService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                BotConfigDataService,
                { provide: Router, useClass: class { navigate = jasmine.createSpy('navigate'); } },
                RoutesModule,
            ],
        });
    });

    it('should be created', inject([BotConfigDataService], (service: BotConfigDataService) => {
        expect(service).toBeTruthy();
    }));

    it('should set & get', inject([BotConfigDataService], (service: BotConfigDataService) => {
        expect(service).toBeTruthy();
        const heroes = ['luna', 'blood_seeker'];
        service.setSelectedHeroes(heroes);
        service.getSelectedHeroes().subscribe((resultHeroes) => {
            expect(resultHeroes).toBe(heroes);
        });
    }));

    it('should ensure - update', inject([BotConfigDataService], (service: BotConfigDataService) => {
        expect(service).toBeTruthy();
        let config = service.getConfig();
        expect(config.heroes.length).toBe(0);
        const abilities = 'qeqeqewwwwrrnnnntnnnqw';
        service.updateHeroAbilities('luna', abilities);
        config = service.getConfig();
        expect(config.heroes.length).toBe(1);
        expect(config.heroes[0].abilities.abilities).toBe(abilities);
    }));
});