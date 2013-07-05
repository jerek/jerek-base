<?php

namespace JerekBase\Entity;

trait UserPropertyTrait
{
    /**
     * @var int
     * @ORM\Column(name="user_id", type="string")
     */
    private $user;
}
