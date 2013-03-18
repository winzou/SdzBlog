<?php

namespace Sdz\UserBundle;

use Symfony\Component\HttpKernel\Bundle\Bundle;

class SdzUserBundle extends Bundle
{
  public function getParent()
  {
    return 'FOSUserBundle';
  }
}
