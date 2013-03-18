<?php

namespace Sdz\BlogBundle\Akismet;

use Symfony\Component\Validator\Constraint;

/**
 * @Annotation
 */
class Akismet extends Constraint
{
  public $message = 'Le message est considéré comme du spam.';

  public function validatedBy()
  {
    return 'akismet';
  }

  public function getTargets()
  {
    return self::CLASS_CONSTRAINT;
  }
}
