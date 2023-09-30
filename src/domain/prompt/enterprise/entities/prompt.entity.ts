import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface IPromptProps {
  enabled: boolean

  title: string
  template: string

  createdAt: Date
  updatedAt?: Date | null
}

export class PromptEntity extends Entity<IPromptProps> {
  get enabled() {
    return this.props.enabled
  }

  set enabled(enabled: boolean) {
    this.props.enabled = enabled
  }

  get title() {
    return this.props.title
  }

  set title(title: string) {
    this.props.title = title
  }

  get template() {
    return this.props.template
  }

  set template(template: string) {
    this.props.template = template
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<IPromptProps, 'enabled' | 'createdAt'>,
    id?: UniqueEntityID,
  ) {
    const audio = new PromptEntity(
      {
        ...props,
        enabled: props.enabled === undefined ? true : props.enabled,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )

    return audio
  }
}
