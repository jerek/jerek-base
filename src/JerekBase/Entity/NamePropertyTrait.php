<?php

namespace JerekBase\Entity;

trait NamePropertyTrait
{
    /**
     * @var string
     * @ORM\Column(type="string")
     */
    private $name;

    /**
     * @param string $name
     */
    public function setName($name)
    {
        $this->name = $name;
    }

    /**
     * @return string
     */
    public function getName()
    {
        return $this->name;
    }

}
