/* eslint-disable @typescript-eslint/naming-convention */
import {authenticate} from '@loopback/authentication';
import {
  Count,
  CountSchema,
  Filter,
  repository,
  Where
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef, param, post, requestBody,
  response
} from '@loopback/rest';
import {AuthStrategy} from '../auth';
import {State} from '../models';
import {StateRepository} from '../repositories';
export class StateController {
  constructor(
    @repository(StateRepository)
    public stateRepository: StateRepository,
  ) {
  }

  @authenticate({strategy: AuthStrategy.Sign})
  @post('/states')
  @response(200, {
    description: 'State model instance',
    content: {'application/json': {schema: getModelSchemaRef(State)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(State, {
            title: 'NewState',
            exclude: ['id', 'createdBy', 'createdOn', 'updatedOn', 'stale'],
          }),
        },
      },
    })
    state: Omit<State, 'id'>,
  ): Promise<State> {
    return this.stateRepository.create(state);
  }

  @get('/states/count')
  @response(200, {
    description: 'State model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(State) where?: Where<State>,
  ): Promise<Count> {
    return this.stateRepository.count(where);
  }

  @get('/states')
  @response(200, {
    description: 'Array of State model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(State, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(State) filter?: Filter<State>,
  ): Promise<State[]> {
    return this.stateRepository.find(filter);
  }
}
